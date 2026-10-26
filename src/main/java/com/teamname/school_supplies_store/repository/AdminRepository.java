package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository 
public interface  AdminRepository extends JpaRepository<Admin,Integer>{
    Optional<Admin> findByUser_Id(Integer id);
}
