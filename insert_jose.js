import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssjijxmoqibavcbhxaao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamlqeG1vcWliYXZjYmh4YWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzIxNDcsImV4cCI6MjEwMDc0ODE0N30.quWoNDy4cLJedeHkEdzjyrGEAdSyTkDY77Xoxg3Nmqk';

const supabase = createClient(supabaseUrl, supabaseKey);

const newMember = {
  id: crypto.randomUUID(),
  name: 'JOSE WILSON FERREIRA MENDES',
  phone: '6199631-7506',
  type: 'Jovem',
  role: 'Componente',
  gender: 'M',
  registrationType: 'Com Camisa',
  totalValue: 130,
  paidValue: 0,
  paymentStatus: 'Pendente',
  shirts: []
};

async function insert() {
  const { data, error } = await supabase.from('members').insert({ id: newMember.id, data: newMember });
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Successfully inserted Jose Wilson!", data);
  }
}

insert();
