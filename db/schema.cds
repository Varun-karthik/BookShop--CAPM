namespace my.bookstore;
entity Books : AuditInfo{    //Aspect is added after : beside entity name 
    key ID: UniqueNumber;  
    @title: 'Book Name'
    title : Name; //Unlimited length
    @mandatory
    price : Number;
    stock: Number;// Reusing data type instead of creating repeatedly
    percentage:Decimal(5, 2);
    category : Name
}

// Instead of using a data type repeatedly we create a type and reuse it 

type Number : Integer; //Limited length
type Name : String(50); // type is string 
type UniqueNumber : UUID; //Generates id Automatically


// Using aspects we use this if multiple tables have same columns 
aspect AuditInfo {
  createdAt : Timestamp;
  createdBy : String;
}
//Associations
entity Authors{
  @Capabilities.InsertRestrictions.Insertable: true
  key ID: UniqueNumber; //One to one Association
      name : Name;
      books : Association to Books//One to Many Association
}

// Composition
entity Orders{
  key ID: UniqueNumber;
  items: Composition of many OrderItems on items.order=$self;
}

entity OrderItems{
  key ID:UniqueNumber;
  product : Name;
  order: Association to Orders
}