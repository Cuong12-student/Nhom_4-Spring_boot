package com.teamname.school_supplies_store;

import com.teamname.school_supplies_store.entity.OrderDetail;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class SchoolSuppliesStoreApplicationTests {

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private EntityManager entityManager;

	@Test
	void contextLoads() {
	}

	@Test
	void pageUsesStablePagedModelSerialization() {
		JsonNode json = objectMapper.valueToTree(new PageImpl<>(List.of("item")));

		assertTrue(json.has("content"));
		assertTrue(json.has("page"));
		assertEquals(0, json.at("/page/number").asInt());
		assertEquals(1, json.at("/page/size").asInt());
		assertFalse(json.has("number"));
	}

	@Test
	@Transactional
	void orderDetailPreservesVariantPrice() {
		BigDecimal price = new BigDecimal("12345678901.23");
		OrderDetail detail = new OrderDetail(1, price);
		entityManager.persist(detail);
		entityManager.flush();
		Integer id = detail.getId();
		entityManager.clear();

		assertEquals(0, price.compareTo(entityManager.find(OrderDetail.class, id).getPrice()));
	}

}
