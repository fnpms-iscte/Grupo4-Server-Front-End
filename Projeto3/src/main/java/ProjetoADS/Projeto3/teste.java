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

			List<Sala> salasList = new ArrayList<Sala>();

			while (results.next()) {

				Sala aux_sala = new Sala();
				System.out.println(results.getString("Nome Sala"));
				aux_sala.setEdificio(results.getString("Edifício"));
				aux_sala.setNomeSala(results.getString("Nome Sala"));
				aux_sala.setCapacidadeNormal(results.getInt("Capacidade Normal"));
				aux_sala.setCapacidadeExame(results.getInt("Capacidade Exame"));				
				aux_sala.setN_caracteristicas(results.getInt("Nº características"));	
				aux_sala.setAnfiteatroaulas(results.getString("Anfiteatro aulas").isBlank());
				aux_sala.setApoiotecnicoeventos(results.getString("Apoio técnico eventos").isBlank());
				aux_sala.setArq1(results.getString("Arq 1").isBlank());
				aux_sala.setArq2(results.getString("Arq 2").isBlank());
				aux_sala.setArq3(results.getString("Arq 3").isBlank());
				aux_sala.setArq4(results.getString("Arq 4").isBlank());
				aux_sala.setArq5(results.getString("Arq 5").isBlank());
				aux_sala.setArq6(results.getString("Arq 6").isBlank());
				aux_sala.setArq9(results.getString("Arq 9").isBlank());
				aux_sala.setBYOD(results.getString("BYOD (Bring Your Own Device)").isBlank());
				aux_sala.setFocusGroup(results.getString("Focus Group").isBlank());
				aux_sala.setHorariosalavisivelportalpublico(results.getString("Horário sala visível portal público").isBlank());
				aux_sala.setLaboratoriodeArquitecturadeComputadoresI(results.getString("Laboratório de Arquitectura de Computadores I").isBlank());
				aux_sala.setLaboratoriodeArquitecturadeComputadoresII(results.getString("Laboratório de Arquitectura de Computadores II").isBlank());
				aux_sala.setLaboratoriodeBasesdeEngenharia(results.getString("Laboratório de Bases de Engenharia").isBlank());
				aux_sala.setLaboratoriodeElectronica(results.getString("Laboratório de Electrónica").isBlank());
				aux_sala.setLaboratoriodeInformatica(results.getString("Laboratório de Informática").isBlank());
				aux_sala.setLaboratoriodeJornalismo(results.getString("Laboratório de Jornalismo").isBlank());
				aux_sala.setLaboratoriodeRedesdeComputadoresI(results.getString("Laboratório de Redes de Computadores I").isBlank());
				aux_sala.setLaboratoriodeRedesdeComputadoresII(results.getString("Laboratório de Redes de Computadores II").isBlank());
				aux_sala.setLaboratoriodeTelecomunicacoes(results.getString("Laboratório de Telecomunicações").isBlank());
				aux_sala.setSalaAulasMestrado(results.getString("Sala Aulas Mestrado").isBlank());
				aux_sala.setSalaAulasMestradoPlus(results.getString("Sala Aulas Mestrado Plus").isBlank());
				aux_sala.setSalaNEE(results.getString("Sala NEE").isBlank());
				aux_sala.setSalaProvas(results.getString("Sala Provas").isBlank());
				aux_sala.setSalaReuniao(results.getString("Sala Reunião").isBlank());
				aux_sala.setSaladeArquitectura(results.getString("Sala de Arquitectura").isBlank());
				aux_sala.setSaladeAulasnormal(results.getString("Sala de Aulas normal").isBlank());
				aux_sala.setVideoconferencia(results.getString("videoconferencia").isBlank());
				aux_sala.setAtrio(results.getString("Átrio").isBlank());
				
				
				salasList.add(aux_sala);
			}

			ObjectMapper mapper = new ObjectMapper();
			String JSONOutput = mapper.writeValueAsString(salasList);
			System.out.println(JSONOutput);

		} catch (SQLException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}

}
