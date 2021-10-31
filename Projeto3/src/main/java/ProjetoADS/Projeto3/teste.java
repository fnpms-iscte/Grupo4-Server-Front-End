package ProjetoADS.Projeto3;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Retrive information from mysql DB!
 *
 */
public class teste {

	private static Statement stmt;
	private static ResultSet results;

	public static void main(String[] args) {

		String sql_select = "SELECT * FROM projetoads.`ads - caracterizacao das salas`";

		try (Connection conn = DBconnection.createNewDBconnection()) {

			stmt = conn.createStatement();
			results = stmt.executeQuery(sql_select);

			List<Sala> studentsList = new ArrayList<Sala>();

			while (results.next()) {

				Sala stdObject = new Sala();
				System.out.println(results.getString("Nome Sala"));
				stdObject.setEdificio(results.getString("Edifício"));
				stdObject.setNomeSala(results.getString("Nome Sala"));
				stdObject.setCapacidadeNormal(results.getInt("Capacidade Normal"));
				stdObject.setCapacidadeExame(results.getInt("Capacidade Exame"));				
				stdObject.setN_caracteristicas(results.getInt("Nº características"));	
				stdObject.setAnfiteatroaulas(results.getString("Anfiteatro aulas").isBlank());
				stdObject.setApoiotecnicoeventos(results.getString("Apoio técnico eventos").isBlank());
				stdObject.setArq1(results.getString("Arq 1").isBlank());
				stdObject.setArq2(results.getString("Arq 2").isBlank());
				stdObject.setArq3(results.getString("Arq 3").isBlank());
				stdObject.setArq4(results.getString("Arq 4").isBlank());
				stdObject.setArq5(results.getString("Arq 5").isBlank());
				stdObject.setArq6(results.getString("Arq 6").isBlank());
				stdObject.setArq9(results.getString("Arq 9").isBlank());
				stdObject.setBYOD(results.getString("BYOD (Bring Your Own Device)").isBlank());
				stdObject.setFocusGroup(results.getString("Focus Group").isBlank());
				stdObject.setHorariosalavisivelportalpublico(results.getString("Horário sala visível portal público").isBlank());
				stdObject.setLaboratoriodeArquitecturadeComputadoresI(results.getString("Laboratório de Arquitectura de Computadores I").isBlank());
				stdObject.setLaboratoriodeArquitecturadeComputadoresII(results.getString("Laboratório de Arquitectura de Computadores II").isBlank());
				stdObject.setLaboratoriodeBasesdeEngenharia(results.getString("Laboratório de Bases de Engenharia").isBlank());
				stdObject.setLaboratoriodeElectronica(results.getString("Laboratório de Electrónica").isBlank());
				stdObject.setLaboratoriodeInformatica(results.getString("Laboratório de Informática").isBlank());
				stdObject.setLaboratoriodeJornalismo(results.getString("Laboratório de Jornalismo").isBlank());
				stdObject.setLaboratoriodeRedesdeComputadoresI(results.getString("Laboratório de Redes de Computadores I").isBlank());
				stdObject.setLaboratoriodeRedesdeComputadoresII(results.getString("Laboratório de Redes de Computadores II").isBlank());
				stdObject.setLaboratoriodeTelecomunicacoes(results.getString("Laboratório de Telecomunicações").isBlank());
				stdObject.setSalaAulasMestrado(results.getString("Sala Aulas Mestrado").isBlank());
				stdObject.setSalaAulasMestradoPlus(results.getString("Sala Aulas Mestrado Plus").isBlank());
				stdObject.setSalaNEE(results.getString("Sala NEE").isBlank());
				stdObject.setSalaProvas(results.getString("Sala Provas").isBlank());
				stdObject.setSalaReuniao(results.getString("Sala Reunião").isBlank());
				stdObject.setSaladeArquitectura(results.getString("Sala de Arquitectura").isBlank());
				stdObject.setSaladeAulasnormal(results.getString("Sala de Aulas normal").isBlank());
				stdObject.setVideoconferencia(results.getString("videoconferencia").isBlank());
				stdObject.setAtrio(results.getString("Átrio").isBlank());
				
				
				studentsList.add(stdObject);
			}

			ObjectMapper mapper = new ObjectMapper();
			String JSONOutput = mapper.writeValueAsString(studentsList);
			System.out.println(JSONOutput);
			System.out.println(studentsList );

		} catch (SQLException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}

}
