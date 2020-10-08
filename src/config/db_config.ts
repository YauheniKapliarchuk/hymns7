import { Sequelize } from 'sequelize';
import 'dotenv/config';

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB
} = process.env;

export const dbConfig = new Sequelize(`${POSTGRES_DB}`, `${POSTGRES_USER}`, `${POSTGRES_PASSWORD}`, {
    host: POSTGRES_HOST,
    port: Number(POSTGRES_PORT),

    dialect: 'postgres'
});
