export const getSortedMembers = (members) => {
  return [...members].sort((a, b) => {
    // 1. Role priority
    const rolePriority = {
      'Coordenador': 1,
      'Casal Apoio': 2,
      'Componente': 3
    };
    const roleA = rolePriority[a.role] || 99;
    const roleB = rolePriority[b.role] || 99;
    if (roleA !== roleB) return roleA - roleB;

    // 2. Type priority within Componentes (Casal = Tios, Jovem = Jovens)
    const typePriority = {
      'Casal': 1,
      'Jovem': 2
    };
    const typeA = typePriority[a.type] || 99;
    const typeB = typePriority[b.type] || 99;
    if (typeA !== typeB) return typeA - typeB;

    // 3. Gender priority within Jovens (M then F)
    const genderPriority = {
      'M': 1,
      'F': 2
    };
    const genderA = genderPriority[a.gender] || 99;
    const genderB = genderPriority[b.gender] || 99;
    if (genderA !== genderB) return genderA - genderB;

    // 4. Alphabetical by name
    return (a.name || '').localeCompare(b.name || '');
  });
};
