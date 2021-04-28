# validation.js

client-side form validation

### Prerequisites

jQuery and Bootstrap 4

### Installing

Include validation.js, jQuery and Bootstrap at the header

```
<link rel="stylesheet" href="dist/bootstrap.min.css" />
<script src="dist/jquery.min.js"></script>
<script src="validation.js"></script>
```

### Basic usage

Make sure the form has id and name as well as the form elements.

```
<form id="form" name="form">
  <div class="form-group">
    <label for="exampleInputEmail1">Post</label>
    <input type="text" class="form-control" id="title" name="title" onkeyup="validate({elem:this})"/>
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Body</label>
    <textarea class="form-control" id="body" name="body" onkeyup="validate({elem:this})"></textarea>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
<script>
$(function(){
  Watch(form);
})
<script>
```

## Watch the form
since this is only a client-side validation, the data should be clean before submission. 

```
Watch(
    form, // form_id
    edit= false
)
```
initiate this to watch a specific form so that user cannot submit the form if there's still an error.
Also this is the one that uses the name of the form so make sure the form has a name.

```
$(function(){
  Watch(form)
})
```

### Watch form on edit
If you have an edit form, the user is not required to modify all the field, maybe the user just want to edit a certain field like email, and the rest is fine. 
The Watch() is constantly checking if all the field is validated. But in edit, if there's only 1 field that's modified, that should be ready for submission.

So in your edit form page, you need to initiate a different Watch function and pass the *edit = true*

```
//for edit
$(function(){
  Watch(form, edit=true)
})
```
This allows the user to submit the form without validateing the other field the user didn't modify.


## Using validate()

```
<input type="text" class="form-control" id="title" name="title" onkeyup="validate({elem:this})"/>
```
You can apply this on keyup or change event of form elements. it only accepts object as parameter.
* **elem** - *form elements or id* - required
* **required** - *bool* - default is true
* **valid_email** - *string* - optional, the valid email you want.

```
<input type="email" class="form-control" id="email" name="email" onkeyup="validate({elem:this, valid_email:'gmail.com'})"/>
```

### using invalid and valid message in validate function

You can define custom invalid and valid message for your user. Just pass an object containing invalid_message and/or valid_message.

```
<input ... id="title" name="title" onkeyup="validate({elem:this, required:{invalid_message:'This is required', valid:'Good'}})"/>
```
for displaying the message, just make sure the element's id is the input id plus '_msg'.
Example:
```
<input ... id="title" name="title" onkeyup="validate({elem:this, required:{invalid_message:'This is required', valid:'Good'}})"/>
<small id="title_msg"></small> <!-- element for messages -->
```

The default here is if valid, it only displays a check icon, and a different message if invalid

for email:

```
<input ... type="email" onkeyup="validate({elem:this, valid_email:{valid:'gmail.com', invalid_message:'Please use gmail', valid:'Good'}})"/>
<small id="email_msg"></small> <!-- element for messages -->
```

Just add the valid email as 'valid' inside the object.

