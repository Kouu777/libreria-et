CREATE DATABASE IF NOT EXISTS tienda_libreria;
USE tienda_libreria;

CREATE TABLE IF NOT EXISTS libros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(200) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO libros (titulo, autor, precio, stock) VALUES
('El principito', 'Antoine de Saint-Exupéry', 15000, 10),
('Cien años de soledad', 'Gabriel García Márquez', 20000, 5),
('Crimen y Castigo', 'Fyodor Dostoyevsky', 18000, 8),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 25000, 3),
('Bravery pollo Adulto raza pequena', 'Sabor a pollo', 25990, 20);
