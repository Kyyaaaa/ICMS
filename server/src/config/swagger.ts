import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ICMS API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API cho dự án IELTS Center Management System (ICMS)',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
  },
  // Đường dẫn tới các file chứa comment để tạo API docs (quét tất cả các file trong thư mục routes)
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
