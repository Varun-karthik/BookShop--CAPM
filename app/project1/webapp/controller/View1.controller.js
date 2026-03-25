sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
	"sap/m/MessageBox",
    "sap/m/MessageToast"
], (Controller,Fragment,MessageBox,MessageToast) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
            var oModel=this.getOwnerComponent().getModel("Service_Model")
            // For oData V4 version we read data like this
            var oBookBinding= oModel.bindList("/Books")
            oBookBinding.requestContexts().then(function (aContexts) {
            aContexts.forEach(function (oContext) {
                console.log("Book:", oContext.getObject());
            });
        });
            // For oData V2 version we read data like this
            // oModel.read("/Authors",{
            //     success(oData){
            //         console.log("Authors: ",oData.results)
            //     },
            //     error(oError){
            //         console.log("Error in fetching Authors ", oError)
            //     }
            // })

        },
        _openDialog:function()
        {   
            var oView=this.getView();
            if(!this.cDialog){
                this.cDialog = Fragment.load({
                    id:oView.getId(),
                    name:"project1.view.fragment.CreateUpdate",
                    controller:this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);   
                        return oDialog   // Returns Dialog
                    })
                }
            return  this.cDialog //returns Promise
            
            
        },
        onCreate: function () 
        {   
            // Marking mode for using in save button
            this.mode="create"
            this._openDialog().then(function (oDialog) {
                oDialog.open();
                // clear fields
                this.getView().byId("id").setValue("");
                this.getView().byId("name").setValue("");
                this.getView().byId("price").setValue("");
                this.getView().byId("stock").setValue("");
                this.getView().byId("cby").setValue("");
            }.bind(this));
        },
        onUpdate: function (oEvent) 
        {
            // Marking mode for using in save button
            this.mode="update"
            var oContext = oEvent.getSource().getBindingContext("Service_Model");
            
            // STORING CONTEXT TO USE IN SAVE
            this.oUpdateContext= oContext;

            //Provinding Details into Frgment 
            var oData= oContext.getObject()
            console.log("oData ", oData)
            this._openDialog().then(function (oDialog) {
                oDialog.open();
                // clear fields
                this.getView().byId("id").setValue(oData.ID);
                this.getView().byId("id").setEditable(false);
                this.getView().byId("name").setValue(oData.title);
                this.getView().byId("price").setValue(oData.price);
                this.getView().byId("stock").setValue(oData.stock);
                this.getView().byId("cby").setValue(oData.createdBy);
            }.bind(this));
        },
        
        onCancel:function()
        {
            this.getView().byId("id").setValue("");
            this.getView().byId("name").setValue("");
            this.getView().byId("price").setValue("");
            this.getView().byId("stock").setValue("");
            this.getView().byId("cby").setValue("")

            this._openDialog().then(function (oDialog) {
                oDialog.close();
            });
        },

        // Posting Data 
        onSave:function(){
            console.log("SAVE TRIGGERED");

            var ID = this.getView().byId("id").getValue();
            var Name = this.getView().byId("name").getValue();
            var Price = this.getView().byId("price").getValue();
            var Stock = this.getView().byId("stock").getValue();
            var CBY = this.getView().byId("cby").getValue();

            var oModel=this.getOwnerComponent().getModel("Service_Model")

            var newData=
                {
                "ID":Number(ID),
                "title" : Name,
                "price": Number(Price),
                "stock":Number(Stock),
                "createdBy":CBY
                }

            if(this.mode=="create"){
                
                if(!ID || !Name || !Price )
                    {
                        MessageBox.error("Please fill Mandatory Feilds");
                    }
                
                oModel.bindList("/Books").create(newData);
                MessageToast.show("Book Added Successfully")
            }
            else if(this.mode=="update"){
                
                // Standarad Way (Recomended)

                this.oUpdateContext.setProperty("title",Name)
                this.oUpdateContext.setProperty("price",Price)
                this.oUpdateContext.setProperty("stock",Stock)
                this.oUpdateContext.setProperty("createdBy",CBY)

                MessageToast.show("Book Details Updated Sucessfully")

                // Alternate Way to Update if we know ID
                // var sPath = "/Books("+ ID +")"
                // console.log(sPath )
                // var oContextBinding=oModel.bindContext("/Books("+ ID +")")
                // console.log(oContextBinding);

                // var oContext=oContextBinding.getBoundContext();
                // console.log(oContext)
                // oContext.setProperty("title",Name)
                // oContext.setProperty("price",Price)
                // oContext.setProperty("stock",Stock)
                // oContext.setProperty("createdBy",CBY)

            }

        this.getView().byId("BooksTable").getBinding("items").refresh()
        this.getView().byId("id").setEditable(true)
        this.getView().byId("id").setValue("");
        this.getView().byId("name").setValue("");
        this.getView().byId("price").setValue("");
        this.getView().byId("stock").setValue("");
        this.getView().byId("cby").setValue("")
        
        // Closing the Dialog
        this._openDialog().then(function (oDialog) {
                oDialog.close();
            });
        },

        // Deleting Record
        onDelete: function (oEvent) {
            var oItem = oEvent.getParameter("listItem"); // Selected row
            var oContext = oItem.getBindingContext("Service_Model");  //Passing Model
            
            // Standard Approach
            oContext.delete().then(()=>
            {
                console.log("Deleted Sucessfully");
            }).catch(err=>{
                console.log("Delete Failed ", err)
            })

            var oData = oContext.getObject(); // Actual row Data

            // Manual way NOT RECOMENDED
            // var ID= oData.ID;
            // var oModel= this.getOwnerComponent().getModel("Service_Model")
            // var oContextBinding=oModel.bindContext(`/Books(${ID})`);
            // oContextBinding.requestObject().then(function(){
            //     oContextBinding.delete();
            // })
            console.log("Deleted Row Data:", oData);
        },
        // onUpdate:function(oEvent){
        //     var oItem=oEvent.getParameter("listItem");
        //     var oContext= oItem.getBindingContext("Service_Model");
        //     oContext.setProperty().then(()=>{

        //     })
        //     var oData= oContext.getObject();

        // }
    });
});