using { my.bookstore as my } from '../db/schema';

service CatalogService {
  
    entity Books as projection on my.Books;
    function getd() returns  array of demo;

    //Creating function
    function getStockValue() returns Integer;
    function getNormalBooksCount() returns Integer;

    //Service for Displaying Authors Entity
    entity Authors as projection on my.Authors;
    entity Orders as projection on my.Orders;
    entity OrderItems as projection on my.OrderItems;

    //Defining Action
      action applyDiscount(ID: UUID, percentage: Decimal(5,2)) returns { message: String; newPrice: Decimal(5,2); };
      action increaseStock(ID: UUID, value: Integer); // return type is optional for actions

}


type demo{

 ID: UUID;  
    title : String; //Unlimited length
    author : String;
    price : Integer;
    stock: Integer;
    createdAt : Timestamp;
    createdBy : String;
}