import { PrismaClient } from '@prisma/client';

export async function deleteAllData() {
  const prisma = new PrismaClient();
  
  try {
    // Excluir todos os dados de cada tabela
    await prisma.memory.deleteMany();
    await prisma.user.deleteMany();
    // Adicione mais linhas para cada tabela existente no seu banco de dados
    
    console.log('Todos os dados foram excluídos com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir os dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}