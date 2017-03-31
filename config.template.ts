class AppConfig {
	dbDriver: string = "mysql";
	dbHostname: string = "127.0.0.1";
	dbPort: number = 3306;
	dbName: string = "database";
	dbUsername: string = "username";
	dbPassword: string = "password";
	dbDebug: boolean = false;
}

var config: AppConfig = new AppConfig();

export default config;