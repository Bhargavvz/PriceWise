import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Schema created successfully');

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, location_lat, location_lng, preferences)
      VALUES 
        ('john@example.com', $1, 'John', 'Doe', 40.7128, -74.0060, '{"dietary": ["vegetarian"]}'),
        ('jane@example.com', $1, 'Jane', 'Smith', 40.7580, -73.9855, '{"dietary": ["gluten-free"]}'),
        ('bob@example.com', $1, 'Bob', 'Johnson', 40.7489, -73.9680, '{}')
    `, [hashedPassword]);
    console.log('✅ Users seeded');

    // Seed stores
    await pool.query(`
      INSERT INTO stores (name, chain_name, address, city, state, zip_code, latitude, longitude, phone, hours)
      VALUES 
        ('Whole Foods Market - Union Square', 'Whole Foods', '4 Union Square South', 'New York', 'NY', '10003', 40.7347, -73.9897, '212-673-5388', 
         '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-22:00", "sunday": "8:00-22:00"}'),
        ('Trader Joe''s - Chelsea', 'Trader Joe''s', '675 6th Ave', 'New York', 'NY', '10010', 40.7451, -73.9937, '212-255-2106',
         '{"monday": "8:00-21:00", "tuesday": "8:00-21:00", "wednesday": "8:00-21:00", "thursday": "8:00-21:00", "friday": "8:00-21:00", "saturday": "9:00-21:00", "sunday": "9:00-21:00"}'),
        ('Walmart Supercenter', 'Walmart', '3500 Forest Hill Blvd', 'New York', 'NY', '10001', 40.7580, -73.9855, '212-555-0100',
         '{"monday": "6:00-23:00", "tuesday": "6:00-23:00", "wednesday": "6:00-23:00", "thursday": "6:00-23:00", "friday": "6:00-23:00", "saturday": "6:00-23:00", "sunday": "6:00-23:00"}'),
        ('Target - East River Plaza', 'Target', '517 E 117th St', 'New York', 'NY', '10035', 40.7945, -73.9370, '646-908-0520',
         '{"monday": "7:00-22:00", "tuesday": "7:00-22:00", "wednesday": "7:00-22:00", "thursday": "7:00-22:00", "friday": "7:00-22:00", "saturday": "7:00-22:00", "sunday": "7:00-22:00"}'),
        ('ALDI - Lower East Side', 'ALDI', '500 Grand St', 'New York', 'NY', '10002', 40.7147, -73.9820, '855-955-2534',
         '{"monday": "9:00-20:00", "tuesday": "9:00-20:00", "wednesday": "9:00-20:00", "thursday": "9:00-20:00", "friday": "9:00-20:00", "saturday": "9:00-20:00", "sunday": "9:00-20:00"}'),
        ('Key Food - Upper West Side', 'Key Food', '2372 Broadway', 'New York', 'NY', '10024', 40.7915, -73.9745, '212-873-3030',
         '{"monday": "7:00-22:00", "tuesday": "7:00-22:00", "wednesday": "7:00-22:00", "thursday": "7:00-22:00", "friday": "7:00-22:00", "saturday": "7:00-22:00", "sunday": "7:00-22:00"}')
    `);
    console.log('✅ Stores seeded');

    // Seed products
    await pool.query(`
      INSERT INTO products (name, category, brand, description, image_url, unit_type, dietary_tags)
      VALUES 
        -- Dairy & Eggs
        ('Organic Whole Milk', 'Dairy & Eggs', 'Horizon Organic', 'USDA Organic whole milk', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', 'gallon', '["organic"]'),
        ('Large Eggs', 'Dairy & Eggs', 'Happy Egg Co', 'Free-range large brown eggs', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300', 'dozen', '["free-range"]'),
        ('Greek Yogurt', 'Dairy & Eggs', 'Chobani', 'Plain non-fat Greek yogurt', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300', '32oz', '["vegetarian"]'),
        ('Cheddar Cheese', 'Dairy & Eggs', 'Tillamook', 'Sharp cheddar cheese block', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300', '8oz', '["vegetarian"]'),
        
        -- Produce
        ('Organic Bananas', 'Produce', 'Organic', 'Fresh organic bananas', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300', 'lb', '["organic", "vegan"]'),
        ('Roma Tomatoes', 'Produce', null, 'Fresh roma tomatoes', 'https://images.unsplash.com/photo-1546470427-e26264c9c6ab?w=300', 'lb', '["vegan"]'),
        ('Baby Spinach', 'Produce', 'Earthbound Farm', 'Organic baby spinach', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300', '5oz', '["organic", "vegan"]'),
        ('Avocados', 'Produce', null, 'Hass avocados', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', 'each', '["vegan"]'),
        ('Sweet Potatoes', 'Produce', null, 'Organic sweet potatoes', 'https://images.unsplash.com/photo-1551623254-5c6f886fac3f?w=300', 'lb', '["organic", "vegan"]'),
        
        -- Meat & Seafood
        ('Ground Beef', 'Meat & Seafood', 'Butcher''s Choice', '80/20 ground beef', 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=300', 'lb', null),
        ('Chicken Breast', 'Meat & Seafood', 'Perdue', 'Boneless skinless chicken breast', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300', 'lb', null),
        ('Atlantic Salmon', 'Meat & Seafood', 'Wild Caught', 'Fresh Atlantic salmon fillet', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300', 'lb', null),
        
        -- Bakery
        ('Whole Wheat Bread', 'Bakery', 'Dave''s Killer Bread', '21 whole grains bread', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', '27oz', '["organic"]'),
        ('Croissants', 'Bakery', 'La Boulangerie', 'Butter croissants', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300', '6 pack', '["vegetarian"]'),
        
        -- Pantry
        ('Organic Pasta', 'Pantry', 'Barilla', 'Organic spaghetti', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300', '16oz', '["organic", "vegan"]'),
        ('Olive Oil', 'Pantry', 'Bertolli', 'Extra virgin olive oil', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', '25.5oz', '["vegan"]'),
        ('Peanut Butter', 'Pantry', 'Skippy', 'Creamy peanut butter', 'https://images.unsplash.com/photo-1566466809680-1c6d4c0d0fb0?w=300', '16oz', '["vegan"]'),
        ('Quinoa', 'Pantry', 'Ancient Harvest', 'Organic quinoa', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', '12oz', '["organic", "vegan", "gluten-free"]'),
        ('Black Beans', 'Pantry', 'Goya', 'Canned black beans', 'https://images.unsplash.com/photo-1589894187310-f02cb8086697?w=300', '15oz', '["vegan"]'),
        
        -- Beverages
        ('Orange Juice', 'Beverages', 'Tropicana', 'Pure Premium orange juice', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300', '52oz', '["vegan"]'),
        ('Coffee Beans', 'Beverages', 'Starbucks', 'Pike Place roast', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300', '12oz', '["vegan"]'),
        ('Almond Milk', 'Beverages', 'Almond Breeze', 'Unsweetened almond milk', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', '64oz', '["vegan"]'),
        
        -- Snacks
        ('Potato Chips', 'Snacks', 'Lay''s', 'Classic potato chips', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300', '10oz', '["vegan"]'),
        ('Granola Bars', 'Snacks', 'Nature Valley', 'Crunchy oats & honey', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=300', '12 pack', '["vegetarian"]'),
        ('Mixed Nuts', 'Snacks', 'Planters', 'Deluxe mixed nuts', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300', '15.25oz', '["vegan"]'),
        
        -- Frozen
        ('Frozen Pizza', 'Frozen', 'DiGiorno', 'Rising crust pepperoni pizza', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300', '27.5oz', null),
        ('Ice Cream', 'Frozen', 'Ben & Jerry''s', 'Chocolate chip cookie dough', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300', 'pint', '["vegetarian"]'),
        ('Frozen Vegetables', 'Frozen', 'Birds Eye', 'Mixed vegetables', 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=300', '16oz', '["vegan"]')
    `);
    console.log('✅ Products seeded');

    // Seed prices
    const productsResult = await pool.query('SELECT id FROM products');
    const productIds = productsResult.rows.map(r => r.id);
    
    const storesResult = await pool.query('SELECT id FROM stores');
    const storeIds = storesResult.rows.map(r => r.id);

    const priceInserts = [];
    productIds.forEach(productId => {
      storeIds.forEach(storeId => {
        const basePrice = (Math.random() * 15 + 1).toFixed(2);
        const variation = (Math.random() * 2 - 1).toFixed(2);
        const price = Math.max(0.99, parseFloat(basePrice) + parseFloat(variation)).toFixed(2);
        const unitSize = (Math.random() * 3 + 0.5).toFixed(2);
        const unitPrice = (price / unitSize).toFixed(4);
        const onSale = Math.random() > 0.7;
        
        priceInserts.push(`(${productId}, ${storeId}, ${price}, ${unitSize}, ${unitPrice}, ${onSale}, ${onSale ? "'2025-11-15'" : 'NULL'})`);
      });
    });

    await pool.query(`
      INSERT INTO prices (product_id, store_id, price, unit_size, unit_price, on_sale, sale_end_date)
      VALUES ${priceInserts.join(',\n')}
    `);
    console.log('✅ Prices seeded');

    // Seed historical prices (for price trends)
    const historicalInserts = [];
    productIds.slice(0, 10).forEach(productId => {
      storeIds.slice(0, 3).forEach(storeId => {
        for (let daysAgo = 30; daysAgo > 0; daysAgo -= 3) {
          const basePrice = (Math.random() * 15 + 1).toFixed(2);
          const variation = (Math.random() * 2 - 1).toFixed(2);
          const price = Math.max(0.99, parseFloat(basePrice) + parseFloat(variation)).toFixed(2);
          const unitSize = (Math.random() * 3 + 0.5).toFixed(2);
          const unitPrice = (price / unitSize).toFixed(4);
          
          historicalInserts.push(
            `(${productId}, ${storeId}, ${price}, ${unitSize}, ${unitPrice}, false, NULL, CURRENT_DATE - INTERVAL '${daysAgo} days')`
          );
        }
      });
    });

    await pool.query(`
      INSERT INTO prices (product_id, store_id, price, unit_size, unit_price, on_sale, sale_end_date, date_recorded)
      VALUES ${historicalInserts.join(',\n')}
    `);
    console.log('✅ Historical prices seeded');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
