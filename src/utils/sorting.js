const originalOrder = [
  'GEOMAR',
  'JULIANA LOPES',
  'GEOVANIO GOMES XAVIER',
  'JOSÉ CARLOS DOS SANTOS SOUZA',
  'NELINHO OLIVEIRA DO PRADO',
  'EDMILSON DOS SANTOS ALVES',
  'ANTONIO GILBERTO DA SILVA',
  'ANTONIO LUIZ DE OLIVEIRA NETO',
  'ADILSON DA HORA VALVERDE',
  'TITO ALVES DE SOUSA',
  'LUCAS CARVALHO PAIVA',
  'RAMON DA SILVA RAMOS',
  'LUIZ FELIPE DA CRUZ DE OLIVEIRA',
  'DAVID JUNIO ALVES CARDOSO',
  'DENSEL MAXOEL BEZERRA SAMPAIO',
  'LUCAS GODOY DE OLIVEIRA',
  'LUÍS FILIPE MOREIRA SOBRINHO',
  'LUCAS ADRIANO BARROS DA SILVA',
  'MARCOS ANTÔNIO RAMOS GOMES JÚNIOR',
  'RODRIGO BARBOSA DE FRANÇA',
  'DIOGO DINIZ',
  'WALLYSON NUNES DE OLIVEIRA',
  'VICTOR AUGUSTO MARQUES DE ARAÚJO',
  'JOSE WILSON FERREIRA MENDES',
  'JOSÉ WILSON FERREIRA MENDES',
  'JOSÉ WILSON',
  'JOSE WILSON',
  'ADRIELY AQUINO DA MATA',
  'RAIANE CRUZ SALGADO',
  'ANA CAROLINE SAMPAIO DE SOUZA',
  'YASMIN DA SILVA LOPES',
  'IARA LUYZA XAVIER DO NASCIMENTO',
  'ALYCIA DRIENY SANTOS DA SILVA',
  'BYANKA OLIVEIRA DA SILVA',
  'EMANUELE MARYANA SOUSA NERY',
  'FERNANDA QUARESMA PESSOA',
  'GEOVANNA SILVA RODRIGUES',
  'BÁRBARA SILVA DAMASCENA',
  'NOEMI DE SOUZA BARROS',
  'PATRINE LORRANE ACIOLI BATISTA',
  'PRISCILA RIBEIRO MARQUES',
  'SORAIA MARTINS FRANÇA'
];

export const getSortedMembers = (members) => {
  return [...members].sort((a, b) => {
    // 0. Dropouts to the very end
    if (a.isDropout !== b.isDropout) {
      return a.isDropout ? 1 : -1;
    }

    const nameA = (a.name || '').toUpperCase().trim();
    const nameB = (b.name || '').toUpperCase().trim();
    
    // 1. ABSOLUTE PRIORITY: Original predefined order
    const indexA = originalOrder.indexOf(nameA);
    const indexB = originalOrder.indexOf(nameB);
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB; // Both are in the original list, strictly follow that order
    }
    if (indexA !== -1 && indexB === -1) return -1; // A is in original list, B is not. A comes first.
    if (indexA === -1 && indexB !== -1) return 1;  // B is in original list, A is not. B comes first.

    // 2. If both are new additions, sort by Role -> Type -> Gender -> Alphabetical
    const roleA_val = (a.role || 'Componente').toUpperCase();
    const roleB_val = (b.role || 'Componente').toUpperCase();

    const rolePriority = {
      'COORDENADOR': 1,
      'CASAL APOIO': 2,
      'COMPONENTE': 3
    };
    const roleNumA = rolePriority[roleA_val] || 99;
    const roleNumB = rolePriority[roleB_val] || 99;
    if (roleNumA !== roleNumB) return roleNumA - roleNumB;

    const typeA_val = (a.type || 'Jovem').toUpperCase();
    const typeB_val = (b.type || 'Jovem').toUpperCase();
    
    const typePriority = {
      'CASAL': 1,
      'JOVEM': 2
    };
    const typeNumA = typePriority[typeA_val] || 99;
    const typeNumB = typePriority[typeB_val] || 99;
    if (typeNumA !== typeNumB) return typeNumA - typeNumB;

    const genderPriority = {
      'M': 1,
      'F': 2
    };
    const genderA = genderPriority[(a.gender || 'M').toUpperCase()] || 99;
    const genderB = genderPriority[(b.gender || 'M').toUpperCase()] || 99;
    if (genderA !== genderB) return genderA - genderB;

    // 3. If both are new additions, sort alphabetically by name
    return nameA.localeCompare(nameB);
  });
};
