import DownloadButton from './components/DownloadButton';
import './index.css';

function App() {
  
  // PASSO 2.1: Criar a função que executa a ação real.
  // Esta função será passada para o nosso botão.
  const handleActualDownload = () => {
    console.log("A animação terminou! Iniciando o download real...");

    // Lógica para forçar o download de um arquivo no navegador
    // (Este exemplo baixa um arquivo de imagem de um URL público)
    
    // O URL do arquivo que você quer que o usuário baixe.
    // Pode ser um link para um PDF, uma imagem, um .zip, etc.
    const fileUrl = "https://youtube.com"; 
    
    // O nome que o arquivo terá no computador do usuário.
    const fileName = "beautiful-landscape.png";

    // 1. Cria um elemento <a> invisível na memória
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // O atributo 'download' força o download

    // 2. Adiciona o link ao corpo do documento (necessário para alguns navegadores)
    document.body.appendChild(link);

    // 3. Simula um clique no link
    link.click();

    // 4. Remove o link do documento para limpar a sujeira
    document.body.removeChild(link);
  };

  return (
    <div>
      <DownloadButton onDownloadComplete={handleActualDownload} />
    </div>
  );
}

export default App;