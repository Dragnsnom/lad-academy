import express, { Request, Response } from 'express';
import { Transport } from '../../common/Transport';
import { StorageMethods } from '../../common/constants';

const app = express();
const port = process.env.PORT || 3000;

// Создаем экземпляр Transport и устанавливаем соединение
const transport = new Transport();
transport.connect();

// Middleware для обработки JSON-запросов
app.use(express.json());

// GET /api/test - Получить все Test сущности из бд
app.get('/api/test', async (req: Request, res: Response) => {
  try {
    const result = await transport.publish(StorageMethods.Test.find, null);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Запускаем сервер
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

