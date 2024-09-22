const formatarData = (dataString) => {
    const data = new Date(dataString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const dataFormatada = data.toLocaleDateString('pt-BR', options); // Ajuste para o formato desejado
    const horaFormatada = `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
    return { dataFormatada, horaFormatada };
  };
  
  export default formatarData;