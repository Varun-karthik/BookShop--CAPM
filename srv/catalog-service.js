export default (srv) => {

  // Validate before creating or updating a Book
  srv.before(['CREATE', 'UPDATE'], 'Books', async (req) => {
    const { ID } = req.data; // only key is available
    const book = await SELECT.one.from('my.bookstore.Books').where({ ID });

    if (!book) {
      req.error(404, "Book not found");
    }

    if (book.price < 0) {
      console.log("REQUEST RECEIVED");
      req.error(400, "Invalid Price — cannot create/update book with negative price");
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



  // Add discount field after reading Books
  srv.after('READ', 'Books', (books) => {
    books.forEach(book => {
      book.discount = book.price * 0.1; // Extra field added to response but not database
      console.log("REQUEST RECEIVED2");
      
    });
  });

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
 