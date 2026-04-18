import supabase from './supabase.js'



async function loadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  if (error) {
    console.error(error)
    return
  }
  console.log(data) // 👈 for now just see if it works
}

loadProducts()