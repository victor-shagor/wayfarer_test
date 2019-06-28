import bodyParser from 'body-parser';
import express from 'express';

import userRouter from './server/routes/userRouter';
import tripRouter from './server/routes/tripRouter';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', userRouter);
app.use('/', tripRouter);
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Wayfarer' }));
app.use('*', (req, res) => res.send({ message: 'route not found' }));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening from port ${port}`);
});

export default app;
