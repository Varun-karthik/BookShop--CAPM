export default (srv) => {

  // Validate before creating or updating a Book
  // CREATE OPERATION
  srv.before('CREATE', 'Books',  (req) => {
    const price=req.data.price;
    console.log("Price:" ,price)
    if (price < 0) {
      console.log("Price Invalid");
      req.error(400, "Invalid Price — cannot create/update book with negative price");
    }
    if (price >500) {
      req.data.category='Premium';
    }
  });

  // Add discount field after reading Books
  // READ OPERATION
  srv.after('READ', 'Books', (books) => {
    books.forEach(book => {
      book.discount = book.price * 0.1; // Extra field added to response but not database
      console.log("Added Discount");
      
    });
  });

  // UPDATE OPERATION
  srv.before('UPDATE', 'Books', async (req) => {
    const { ID } = req.data; // only key is available
    const book = await SELECT.one.from('my.bookstore.Books').where({ ID });
    console.log(book)
    if (req.data.price < 0) {
      req.error(400, 'Price cannot be negative');
    }
  });

  // DELETE OPERATION
  srv.before('DELETE', 'Books', async (req) => {
    const { ID } = req.params[0]; // Fetching Key from Parameter i.e, Request
    const book = await SELECT.one.from('my.bookstore.Books').where({ ID });
    if (!book) {
    req.error(404, `Book with ID ${ID} not found`);
  }
  });

  // Custom function declared in service definition
  srv.on('getStockValue', async()=>{
    const books = await SELECT.from('my_bookstore_Books'); //  fixed namespace
    let total = 0;
    console.log(books);
    books.forEach(book => {
      console.log(book.PRICE,book.STOCK)
      total += book.PRICE * book.STOCK;
    });
    console.log("Total : ",total)
    return total;
  });

  srv.on('getd', async (req) => {
  return await SELECT.from('my_bookstore_Books');
});

  // Custom Function
  srv.on('getNormalBooksCount', async(req)=>{
    const books=await SELECT.from('my.bookstore.Books');
    let count =0;
    if(books){
      books.forEach(book=>{
      console.log("category ", book.category  )
      if(book.category==null){
        count++
      }
      
    })
    }
    return {count}
  })

  //Custom Action
srv.on('applyDiscount', async (req) => {
  const { ID, percentage } = req.data;
  const book = await SELECT.one.from('my.bookstore.Books').where({ ID });

  if (!book) {
    return req.error(404, "Book not found");
  }

  const newPrice = book.price - (book.price * percentage / 100);
  await UPDATE('my.bookstore.Books').set({ price: newPrice }).where({ ID });

  return { message: "Discount Applied", newPrice };  // return JSON object
});
  srv.on('increaseStock',async(req)=>{
    const {ID,value}=req.data
    const books=await SELECT.one('my.bookstore.Books').where({ID})
    if(!books){
      req.reject(400,`Invalid ID: ${ID}`)
    }
    await UPDATE('my.bookstore.Books').set({stock:value}).where({ID})
    return value
  })


  

  // Example override if you want to replace the READ handler completely
  // srv.on('READ', 'Books', async (req) => {
  //   return [
  //     { ID: 1, title: "Custom Book" }
  //   ];
//  });


}


//  const cd=require('@sap/cds')
// module.exports=cd.service.impl(function(){
//   this.on("getd",async()=>{
//      const data= await cd.connect("db");

//    const result=await data.run("SELECT * FROM my_bookstore_Books")
//   return result;
//  })

//  this.on("READ","Books",async( req, next)=>{
// const result= await next();
// return result;

//  } )

//  })
 