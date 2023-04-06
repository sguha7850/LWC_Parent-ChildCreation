import { LightningElement, track, api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class AccountCreation extends LightningElement {

    name='';

    @track showChildButton = false;
    @track showContactForm = false;
    @api accountId;
    @track contactFields = { AccountId: '', FirstName: '', LastName: '', Email: '' };

    handleNameChange(event) {
       // this.accountId = undefined;
        this.name = event.target.value;
    }

    handleNewAccount() {
        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.name;
        const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                this.showChildButton = true;

                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'New account record created',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);
            })
            .catch(error => {
                console.error(error);
            });
    }

    handleNewContact() {
        this.contactFields.AccountId = this.accountId;
        this.showContactForm = true;
    }

    handleFieldChange(event) {
        //const field = event.target.label;
        //const value = event.target.value;
        //this.contactFields[field] = value;

        this.contactId = undefined;

        if (event.target.label==='First Name')
        {
            this.contactFields.FirstName= event.target.value;
        }

        else if (event.target.label==='Last Name')
        {
            this.contactFields.LastName = event.target.value;
        }

        else if (event.target.label==='Email')
        {
            this.contactFields.Email = event.target.value;
        }
    }

    handleSaveContact() {
        const fieldsContact = this.contactFields;
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, 'fields': fieldsContact };
        createRecord(recordInput)
            .then(contact => {
                this.contactId = contact.id;
                //console.log(contact);
                this.showContactForm = false;

                const toastEvent = new ShowToastEvent({
                    title: 'Success!',
                    message: 'New contact record created',
                    variant: 'success'
                });
                this.dispatchEvent(toastEvent);

            })
            .catch(error => {
                console.error(error);
            });
    }
}