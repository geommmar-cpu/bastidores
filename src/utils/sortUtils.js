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

    // Helper to fix roles in case the database is wrong
    const getSafeRole = (member, name) => {
      if (['GEOMAR', 'JULIANA LOPES'].includes(name)) return 'Coordenador';
      if (['GEOVANIO GOMES XAVIER'].includes(name)) return 'Casal Apoio';
      return member.role || 'Componente';
    };

    const getSafeType = (member, name) => {
      if (['GEOVANIO GOMES XAVIER'].includes(name)) return 'Casal';
      return member.type || 'Jovem';
    };

    const roleA_val = getSafeRole(a, nameA);
    const roleB_val = getSafeRole(b, nameB);

    // 1. Role priority (Coordenador -> Casal Apoio -> Componente)
    const rolePriority = {
      'Coordenador': 1,
      'Casal Apoio': 2,
      'Componente': 3
    };
    const roleA = rolePriority[roleA_val] || 99;
    const roleB = rolePriority[roleB_val] || 99;
    if (roleA !== roleB) return roleA - roleB;

    // 2. Type priority within Componentes (Casal = Tios, Jovem = Jovens)
    const typeA_val = getSafeType(a, nameA);
    const typeB_val = getSafeType(b, nameB);
    
    const typePriority = {
      'Casal': 1,
      'Jovem': 2
    };
    const typeA = typePriority[typeA_val] || 99;
    const typeB = typePriority[typeB_val] || 99;
    if (typeA !== typeB) return typeA - typeB;

    // 3. Gender priority within Jovens (M then F)
    const genderPriority = {
      'M': 1,
      'F': 2
    };
    const genderA = genderPriority[a.gender] || 99;
    const genderB = genderPriority[b.gender] || 99;
    if (genderA !== genderB) return genderA - genderB;

    // 4. Original predefined order (within the exact same group)
    
    const indexA = originalOrder.indexOf(nameA);
    const indexB = originalOrder.indexOf(nameB);
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB; // Keep original relative order
    }
    if (indexA !== -1) return -1; // A is original, B is new -> A comes first (new people go to the bottom of the group)
    if (indexB !== -1) return 1;  // B is original, A is new -> B comes first

    // 5. If both are new additions (like José Wilson), sort alphabetically within the group
    return nameA.localeCompare(nameB);
  });
};
