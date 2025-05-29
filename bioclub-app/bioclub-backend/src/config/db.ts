import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI) {
  console.error('Erro: MONGO_URI não definido no .env');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
      // useNewUrlParser: true, // Opções depreciadas no Mongoose 6+
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Opção não mais suportada
      // useFindAndModify: false, // Opção não mais suportada
    });
    console.log('MongoDB conectado com sucesso.');

    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado.');
    });

  } catch (error) {
    console.error('Falha ao conectar ao MongoDB:', error);
    process.exit(1); // Sai do processo com falha
  }
};

export default connectDB;
