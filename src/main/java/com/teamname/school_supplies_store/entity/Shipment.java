package com.teamname.school_supplies_store.entity;

import com.teamname.school_supplies_store.enums.ShipmentStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipment")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_shipment")
    private Integer idShipment;

    @OneToOne
    @JoinColumn(
        name = "id_order",
        nullable = false,
        unique = true
    )
    private Order order;

    @Column(length = 100)
    private String carrier;

    @Column(name = "tracking_code", length = 100, unique = true)
    private String trackingCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ShipmentStatus status = ShipmentStatus.PENDING;

    private LocalDateTime shippedAt;

    private LocalDateTime deliveredAt;

    public Shipment() {}
    public Shipment(String carrier, String trackingCode, ShipmentStatus status, LocalDateTime shippedAt, LocalDateTime deliveredAt){
        this.carrier=carrier;
        this.trackingCode=trackingCode;
        this.status=status;
        this.shippedAt=shippedAt;
        this.deliveredAt=deliveredAt;
    }
    public Integer getId() {
        return idShipment;
    }
    public void setId(Integer idShipment){
        this.idShipment=idShipment;
    }
    public String getCarrier(){
        return carrier;
    }
    public void setCarrier(String carrier){
        this.carrier=carrier;
    }
    public ShipmentStatus getStatus(){
        return status;
    }
    public void setStatus(ShipmentStatus status){
        this.status=status;
    }
    public LocalDateTime getShippedAt(){
        return shippedAt;
    }
    public void setShippedAt(LocalDateTime shippedAt){
        this.shippedAt=shippedAt;
    }
    public LocalDateTime getDelivered(){
        return deliveredAt;
    }
    public void setDelivered(LocalDateTime deliveredAt){
        this.deliveredAt=deliveredAt;
    }
}