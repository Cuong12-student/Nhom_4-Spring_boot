package com.teamname.school_supplies_store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@SpringBootApplication
@EnableSpringDataWebSupport(pageSerializationMode = PageSerializationMode.VIA_DTO)
public class SchoolSuppliesStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolSuppliesStoreApplication.class, args);
	}

}
