package com.teamname.school_supplies_store.staff.inventory.service;

import com.teamname.school_supplies_store.entity.Inventory;
import com.teamname.school_supplies_store.entity.Product;
import com.teamname.school_supplies_store.entity.ProductVariant;
import com.teamname.school_supplies_store.entity.Staff;
import com.teamname.school_supplies_store.entity.StockReceipt;
import com.teamname.school_supplies_store.entity.StockReceiptLine;
import com.teamname.school_supplies_store.repository.ProductVariantRepository;
import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptInput;
import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptLineInput;
import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptLineView;
import com.teamname.school_supplies_store.staff.inventory.dto.ReceiptView;
import com.teamname.school_supplies_store.staff.inventory.dto.VariantView;
import com.teamname.school_supplies_store.staff.inventory.repository.StockReceiptRepository;
import com.teamname.school_supplies_store.staff.service.StaffAccessService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** Nghiệp vụ xem biến thể và tạo phiếu nhập kho. */
@Service
public class StaffInventoryService {
    private final StaffAccessService staffAccess;
    private final ProductVariantRepository variants;
    private final StockReceiptRepository receipts;

    public StaffInventoryService(
            StaffAccessService staffAccess,
            ProductVariantRepository variants,
            StockReceiptRepository receipts) {
        this.staffAccess = staffAccess;
        this.variants = variants;
        this.receipts = receipts;
    }

    /** Liệt kê biến thể cùng số lượng tồn kho hiện tại. */
    @Transactional(readOnly = true)
    public List<VariantView> listVariants(String authorization) {
        staffAccess.requireStaff(authorization);
        return variants.findAll().stream().map(variant -> {
            Product product = variant.getProduct();
            return new VariantView(
                    variant.getIdVariant(),
                    product.getName(),
                    variant.getSku(),
                    product.getCategory().getName(),
                    variant.getImage() != null ? variant.getImage() : product.getMainImage(),
                    variant.getStatus().name(),
                    variant.getPrice(),
                    variant.getInventory() == null ? 0 : variant.getInventory().getQuantity());
        }).toList();
    }

    /** Tạo phiếu nhập, cập nhật tồn kho và lưu chi phí của từng dòng hàng. */
    @Transactional
    public ReceiptView receive(String authorization, ReceiptInput input) {
        Staff employee = staffAccess.requireStaff(authorization);
        StockReceipt receipt = new StockReceipt();
        receipt.setStaff(employee);
        receipt.setReceivedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        Set<Long> seenVariantIds = new HashSet<>();
        for (ReceiptLineInput item : input.lines()) {
            if (!seenVariantIds.add(item.variantId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Mỗi biến thể chỉ được xuất hiện một lần trong phiếu.");
            }

            ProductVariant variant = variants.findById(item.variantId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Không tìm thấy biến thể sản phẩm."));
            Inventory inventory = variant.getInventory();
            if (inventory == null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "Không tìm thấy kho của " + variant.getSku());
            }

            inventory.setQuantity(addQuantity(inventory.getQuantity(), item.quantity()));
            BigDecimal lineTotal = item.unitCost().multiply(BigDecimal.valueOf(item.quantity()));
            total = total.add(lineTotal);
            if (total.precision() - total.scale() > 17) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Tổng tiền nhập kho vượt giới hạn cho phép.");
            }
            receipt.addLine(toReceiptLine(item, variant, lineTotal));
        }

        receipt.setTotalCost(total);
        return toReceiptView(receipts.saveAndFlush(receipt));
    }

    private StockReceiptLine toReceiptLine(
            ReceiptLineInput item,
            ProductVariant variant,
            BigDecimal lineTotal) {
        StockReceiptLine line = new StockReceiptLine();
        line.setVariant(variant);
        line.setProductName(variant.getProduct().getName());
        line.setSku(variant.getSku());
        line.setQuantity(item.quantity());
        line.setUnitCost(item.unitCost());
        line.setLineTotal(lineTotal);
        return line;
    }

    private static int addQuantity(int current, int added) {
        try {
            return Math.addExact(current, added);
        } catch (ArithmeticException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Số lượng tồn kho vượt giới hạn.", ex);
        }
    }

    public ReceiptView toReceiptView(StockReceipt receipt) {
        return new ReceiptView(
                receipt.getId(),
                receipt.getReceivedAt(),
                receipt.getStaff().getName(),
                receipt.getTotalCost(),
                receipt.getLines().stream()
                        .map(line -> new ReceiptLineView(
                                line.getProductName(),
                                line.getSku(),
                                line.getQuantity(),
                                line.getUnitCost(),
                                line.getLineTotal()))
                        .toList());
    }
}
