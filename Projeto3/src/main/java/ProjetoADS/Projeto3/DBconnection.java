package ProjetoADS.Projeto3;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBconnection {
	
	private static String dbhost = "jdbc:mysql://127.0.0.1:3306/projetoads?serverTimezone=UTC";
	private static String username = "root";
	private static String password = "root";
	private static Connection conn;

	@SuppressWarnings("finally")
	public static Connection createNewDBconnection() {
		try {
			conn = DriverManager.getConnection(dbhost, username, password);
		} catch (SQLException e) {
			System.out.println("Cannot create database connection");
			e.printStackTrace();
		} finally {
			return conn;
		}
	}
}
