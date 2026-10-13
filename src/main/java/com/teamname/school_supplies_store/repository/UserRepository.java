package com.teamname.school_supplies_store.repository;
import com.teamname.school_supplies_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByCustomer_IdCustomer(Integer idCustomer);
    Optional<User> findByStaff_IdStaff(Integer idStaff);
    Optional<User> findByAdmin_IdAdmin(Integer idAdmin);
    boolean existsByUsername(String username);
}
