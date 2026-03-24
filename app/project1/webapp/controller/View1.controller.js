sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
	"sap/m/MessageBox"
], (Controller,Fragment,MessageBox) => {
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
                        this.cDialog = oDialog;
                        oDialog.open();
                    }.bind(this))
                }
            else{
                this.cDialog.open()
            }
            
        },
        onCreate: function () 
        {
            this._openDialog().then(function (oDialog) {
                oDialog.open();
                // clear fields
                this.getView().byId("id").setValue("");
                this.getView().byId("name").setValue("");
                this.getView().byId("price").setValue("");
                this.getView().byId("stock").setValue("");
                this.getView().byId("cat").setValue("");
                this.getView().byId("cby").setValue("");
            }.bind(this));
        },
        onUpdate: function (oEvent) 
        {
            var oData= oEvent.getSource().getBindingContext("Service_Model")
            console.log("oData ", oData)
            this._openDialog().then(function (oDialog) {
                oDialog.open();
                // clear fields
                this.getView().byId("id").setValue("");
                this.getView().byId("name").setValue("");
                this.getView().byId("price").setValue("");
                this.getView().byId("stock").setValue("");
                this.getView().byId("cat").setValue("");
                this.getView().byId("cby").setValue("");
            }.bind(this));
        },
        
        onCancel:function()
        {
            this.getView().byId("id").setValue("");
            this.getView().byId("name").setValue("");
            this.getView().byId("price").setValue("");
            this.getView().byId("stock").setValue("");
            this.getView().byId("cby").setValue("")

            this.cDialog.close();
        },

        // Posting Data 
        onSave:function(){
            console.log("SAVE TRIGGERED");

            var ID = this.getView().byId("id").getValue();
            var Name = this.getView().byId("name").getValue();
            var Price = this.getView().byId("price").getValue();
            var Stock = this.getView().byId("stock").getValue();
            var CBY = this.getView().byId("cby").getValue("")

            if(!ID || !Name || Price || Stock || CBY){
                MessageBox.error("Please fill Mandatory Feilds");
                
            }

            var newData=
                {
                "ID":Number(ID),
                "title" : Name,
                "price": Number(Price),
                "stock":Number(Stock),
                "createdBy":CBY
        }
        
        var oModel=this.getOwnerComponent().getModel("Service_Model")
        oModel.bindList("/Books").create(newData);

        this.getView().byId("BooksTable").getBinding("items").refresh()
        this.getView().byId("id").setValue("");
        this.getView().byId("name").setValue("");
        this.getView().byId("price").setValue("");
        this.getView().byId("stock").setValue("");
        this.getView().byId("cby").setValue("")
        this.cDialog.close();
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