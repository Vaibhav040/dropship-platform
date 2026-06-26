package com.dropforge.catalog;

import com.dropforge.catalog.model.Product;
import com.dropforge.catalog.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.util.logging.Logger;


@SpringBootApplication
public class CatalogServiceApplication {

    private static final Logger logger = Logger.getLogger(CatalogServiceApplication.class.getName());

	public static void main(String[] args) {
		SpringApplication.run(CatalogServiceApplication.class, args);
	}

	@Bean
    public CommandLineRunner loadData(ProductRepository repository) {
        return args -> {
            // Only seed data if the database is completely empty
            if (repository.count() == 0) {
                Product p1 = new Product();
                p1.setTitle("Minimalist Ergonomic Water Bottle");
                p1.setPrice(34.99);
                p1.setCategory("Lifestyle");
                p1.setImage("https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80");
                p1.setRating(4.8);

                Product p2 = new Product();
                p2.setTitle("Ultra-Thin Wireless Charging Pad");
                p2.setPrice(29.99);
                p2.setCategory("Electronics");
                p2.setImage("https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80");
                p2.setRating(4.5);

                repository.save(p1);
                repository.save(p2);
                logger.info("✅ Sample products seeded into PostgreSQL!");
            }
        };
    }

}
