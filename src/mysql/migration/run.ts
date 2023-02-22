import { EnvUtil } from '../../utils';
import fs from 'fs';
import path from 'path';
import { MySqlDb } from '../db';
import { exit } from 'process';
export namespace MySqlDBMigration {
    export const UpDown = async (up: boolean) => {
        const migration_record_path = 'migration.log.json';
        const completed_migration: {
            completed: string[]
        } = require(`${EnvUtil.MYSQL_MIGRATION}/${migration_record_path}`);
        console.time('Migration Completed In');
        console.info(`MySQL Migration ${up ? 'UP' : 'DOWN'}`);
        let migration_count = 0;
        let migration_failed_count = 0;
        const migrations = fs.readdirSync(EnvUtil.MYSQL_MIGRATION);
        for (let index = 0; index < migrations.length; index++) {
            const migration_path = migrations[index];
            if (migration_path === migration_record_path) {
                continue;
            }
            if (up && completed_migration.completed.includes(migration_path)) {
                continue;
            }
            if (path.extname(migration_path) == ".json") {
                const migration: {
                    up: string,
                    down: string
                } = require(`${EnvUtil.MYSQL_MIGRATION}/${migration_path}`);
                const connection = await MySqlDb.Connection()
                await connection.query(migration[up ? 'up' : 'down']).then(() => {
                    migration_count++;
                    if (up == true) {
                        console.info(`Migration Success ${migration_path}`);
                        completed_migration.completed.push(migration_path);
                    } else {
                        console.info(`Migration Down Success ${migration_path}`);
                    }
                }).catch((err: any) => {
                    migration_failed_count++;
                    console.warn(`Fail ${migration_path}`, err.sqlMessage);
                });
            }
        }
        console.info(`Success: ${migration_count} Fail: ${migration_failed_count}`);
        console.timeEnd('Migration Completed In');
        if (up == true) {
            fs.writeFileSync(`${EnvUtil.MYSQL_MIGRATION}/migration.log.json`, JSON.stringify(completed_migration), 'utf8');
        } else {
            fs.writeFileSync(`${EnvUtil.MYSQL_MIGRATION}/migration.log.json`, JSON.stringify({
                completed: []
            }), 'utf8');
        }
        exit(0);
    };
}

module.exports.MigrationUp = () => {
    MySqlDBMigration.UpDown(true);
};

module.exports.MigrationDown = () => {
    MySqlDBMigration.UpDown(false);
};