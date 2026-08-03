import { getSortedMembers } from './src/utils/sortUtils.js';

const mockMembers = [
  { name: 'GEOMAR', role: 'Coordenador', type: 'Jovem', gender: 'M' },
  { name: 'JULIANA LOPES', role: 'Coordenador', type: 'Jovem', gender: 'F' },
  { name: 'GEOVANIO GOMES XAVIER', role: 'Coordenador', type: 'Casal', gender: 'M' },
  { name: 'JOSÉ CARLOS DOS SANTOS SOUZA', role: 'Componente', type: 'Casal', gender: 'M' },
  { name: 'JOSE WILSON FERREIRA MENDES', role: 'Componente', type: 'Jovem', gender: 'M' },
  { name: 'VICTOR AUGUSTO MARQUES DE ARAÚJO', role: 'Componente', type: 'Jovem', gender: 'M' }
];

console.log("Input order:");
mockMembers.forEach(m => console.log(m.name));

const sorted = getSortedMembers(mockMembers);

console.log("\nOutput order:");
sorted.forEach(m => console.log(m.name));
