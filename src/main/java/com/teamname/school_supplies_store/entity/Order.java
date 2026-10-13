package com.teamname.school_supplies_store.entity; 
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Entity; 
import jakarta.persistence.Table; 
import jakarta.persistence.Id; 
import jakarta.persistence.GeneratedValue; 
import jakarta.persistence.GenerationType; 
import jakarta.persistence.Column; 
import jakarta.persistence.Enumerated; 
import jakarta.persistence.EnumType;  
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.ManyToOne;
import  com.teamname.school_supplies_store.enums.OrderStatus;

@Entity
@Table(name="orders")
public class Order{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_order")
    private Integer idOrder;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    @ManyToOne
    @JoinColumn(name="id_customer")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name="id_staff")
    private Staff staff;
    @OneToOne(mappedBy = "order")
    private Shipment shipment;
    @OneToMany (mappedBy="order")
    private List<OrderDetail> orderDetail;
    public Order(){}
    public Order(LocalDateTime orderDate, BigDecimal totalAmount,OrderStatus status){
        this.orderDate=orderDate;
        this.totalAmount=totalAmount;
        this.status=status;
    }
    public Integer getId(){
        return idOrder;
    }
    public void setId(Integer idOrder){
        this.idOrder=idOrder;
    }
    public LocalDateTime getOrderDate(){
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate){
        this.orderDate=orderDate;
    }
    public BigDecimal getTotalAmount(){
        return totalAmount;
    }
    public void setTotalAmount(BigDecimal totalAmount){
        this.totalAmount=totalAmount;
    }
    public OrderStatus getStatus(){
        return status;
    }
    public void setStatus(OrderStatus status){
        this.status=status;
    }
    public Customer getCustomer(){
        return customer;
    }
    public void setCustomer(Customer customer){
        this.customer=customer;
    }
    public Staff getStaff(){
        return staff;
    }
    public void setStaff(Staff staff){
        this.staff=staff;
    }
    public Shipment getShipment(){
        return shipment;
    }
    public void setShipment(Shipment shipment){
        this.shipment=shipment;
    }
    public List<OrderDetail> getDetail(){
        return orderDetail;
    }
    public void setDetail(List<OrderDetail> orderDetail){
        this.orderDetail=orderDetail;
    }
}