const all = [];
const set = [];
const settled = [];
// only applied for onkeyup attrib ***
// {
// 	elem,
// 	required = bool : default true || object{valid_message: string, invalid_message:string},
// 	valid_email string : default null || object{valid: string, valid_message: string, invalid_message:string},
// }
// **required and **valid_email can be an object containing the valid and invalid message
function validate({ elem, required = true, valid_email }) {
	if (elem) {
		if (required) {
			elem.id in all ? [] : (all[elem.id] = [...arguments]);
			try {
				if (elem.value.length < 1) {
					typeof required == "object"
						? invalid(
								elem,
								required.invalid_message
									? required.invalid_message
									: "This Field is Required!"
						  )
						: invalid(elem, "This Field is Required!");
					if (set.includes(elem.id) && elem.id in all) {
						if (settled.includes(elem.id))
							settled.splice(settled.indexOf(elem.id), 1);
					}
					return false;
				} else {
					if (valid_email) {
						let valid_em =
							typeof valid_email == "object" ? valid_email.valid : valid_email;
						if (elem.value.includes(valid_em)) {
							typeof valid_email == "object"
								? valid(elem, valid_email.valid_message)
								: valid(elem);
							if (set.includes(elem.id) && elem.id in all) {
								if (!settled.includes(elem.id)) settled.push(elem.id);
							}
							return true;
						} else {
							typeof valid_email == "object"
								? invalid(
										elem,
										valid_email.invalid_message
											? valid_email.invalid_message
											: `Email must be ${valid_email.valid}`
								  )
								: invalid(elem, `Email must be ${valid_email}`);
							if (set.includes(elem.id) && elem.id in all) {
								if (settled.includes(elem.id))
									settled.splice(settled.indexOf(elem.id), 1);
							}
							return false;
						}
					} else {
						typeof required == "object"
							? valid(elem, required.valid_message)
							: valid(elem);
						if (set.includes(elem.id) && elem.id in all) {
							if (!settled.includes(elem.id)) settled.push(elem.id);
						}
						return true;
					}
				}
			} catch (error) {
				console.error(`Error: ${error.message}`);
			}
		} else if (valid_email) {
			elem.id in all ? [] : (all[elem.id] = [...arguments]);
			try {
				let valid_em =
					typeof valid_email == "object" ? valid_email.valid : valid_email;
				if (elem.value.includes(valid_em)) {
					typeof valid_email == "object"
						? valid(elem, valid_email.valid_message)
						: valid(elem);
					if (set.includes(elem.id) && elem.id in all) {
						if (!settled.includes(elem.id)) settled.push(elem.id);
					}
					return true;
				} else {
					typeof valid_email == "object"
						? invalid(
								elem,
								valid_email.invalid_message
									? valid_email.invalid_message
									: `Email must be ${valid_email.valid}`
						  )
						: invalid(elem, `Email must be ${valid_email}`);
					if (set.includes(elem.id) && elem.id in all) {
						if (settled.includes(elem.id))
							settled.splice(settled.indexOf(elem.id));
					}
					return false;
				}
			} catch (error) {
				console.error(`Error: ${error.message}`);
			}
		}
	} else {
		console.error("Error: Element is expected, element not provided.");
	}
}

// only applied for onchange of field or onsubmit of form
// options = {
// 	table: default null || string, table name,
// 	field: default null || string, field name,
// 	url: default null, || string url,
//  edit: default null || { id_field: 'id field', 'id': value or id },
// };

// **POST variables
// 'field' : options.field (the field provided by user in options)
// 'where' : [options.field : elem.value] (array for where in query conditions)
// 'table' : options.table (the table provided by user in options)
// 'val' : elem.value (value of element or field)
// 'not_in' : [options.edit.id_field: options.edit.id] (array of where not in condition for query. this is only for update modules, for query condition 'not in');
// 'not_in_field: options.edit.id_field (not in field)
// 'not_in_id: options.edit.id (not in value)
function unique(elem, options) {
	if (elem) {
		elem.id in all ? [] : (all[elem.id] = [...arguments]);
		if (validate(...all[elem.id])) {
			if (typeof options == "object") {
				let field = {};
				let not_in = {};
				if (options.table && options.field && options.url) {
					field[options.field] = elem.value;
					let data = {
						table: options.table,
						field: options.field,
						where: field,
						val: elem.value,
					};
					if (options.edit) {
						not_in[options.edit.id_field] = options.edit.id;
						data["not_in"] = not_in;
						data["not_in_field"] = options.edit.id_field
							? options.edit.id_field
							: null;
						data["not_in_id"] = options.edit.id ? options.edit.id : null;
					}
					$.ajax({
						method: "POST",
						url: `${options.url}`,
						data: data,
						success: (response) => {
							if (response) {
								invalid(
									elem,
									`${
										elem.placeholder ? elem.placeholder : elem.value
									} already exists!`
								);
								if (set.includes(elem.id) && elem.id in all) {
									if (settled.includes(elem.id))
										settled.splice(settled.indexOf(elem.id));
								}
								return false;
							} else {
								valid(elem);
								if (set.includes(elem.id) && elem.id in all) {
									if (!settled.includes(elem.id)) settled.push(elem.id);
								}
								return true;
							}
						},
					});
				} else {
					console.error("Error: Options: table, field, and url are required!");
				}
			} else {
				console.error(
					"Error: unique(element, options={}): Second args must be an object!"
				);
			}
		} else {
			validate(...all[elem.id]);
		}
	} else {
		console.error("Error: Element is expected, element not provided.");
	}
}

const Watch = (form, edit = false) => {
	try {
		all.length = 0;
		settled.length = 0;
		if (form.name) {
			document
				.querySelector("button[type='submit']")
				.setAttribute("disabled", true);

			let elements = [
				...document.forms[`${form.name}`].getElementsByTagName("input"),
				...document.forms[`${form.name}`].getElementsByTagName("select"),
				...document.forms[`${form.name}`].getElementsByTagName("textarea"),
			];

			for (let e in elements) {
				if (elements[e].attributes.onkeyup) {
					if (
						elements[e].attributes.onkeyup.value.includes("validate") &&
						!set.includes(elements[e].id)
					) {
						set.push(elements[e].id);
					}
				} else if (elements[e].attributes.onchange) {
					if (
						(elements[e].attributes.onchange.value.includes("unique") &&
							!set.includes(elements[e].id)) ||
						(elements[e].attributes.onchange.value.includes("validate") &&
							!set.includes(elements[e].id))
					) {
						set.push(elements[e].id);
					}
				}
			}

			const handleChange = (e) => {
				if (settled.length == set.length && !edit) {
					document
						.querySelector("button[type='submit']")
						.removeAttribute("disabled");
				} else if (settled.length != 0 && edit) {
					document
						.querySelector("button[type='submit']")
						.removeAttribute("disabled");
				} else {
					document
						.querySelector("button[type='submit']")
						.setAttribute("disabled", true);
				}
			};

			form.addEventListener("keyup", handleChange);
			form.addEventListener("change", handleChange);
			form.addEventListener("submit", (e) => {
				all.length = 0;
				settled.length = 0;
				document
					.querySelector("button[type='submit']")
					.setAttribute("disabled", true);
			});
		} else {
			console.error("Error : Make sure your form has a name attribute");
		}
	} catch (error) {
		console.error(error.message);
	}
};

const for_edit = () => {
	if (settled.length) {
		document.querySelector("button[type='submit']").removeAttribute("disabled");
	} else {
		return false;
	}
};

const valid = (elem, msg = null) => {
	try {
		elem.classList.remove("is-invalid");
		elem.classList.add("is-valid");
		document.getElementById(`${elem.id}_msg`).classList.remove("text-danger");
		document.getElementById(`${elem.id}_msg`).classList.add("text-success");
		document.getElementById(`${elem.id}_msg`).innerHTML = msg
			? msg
			: '<i class="fas fa-check"></i>';
	} catch (error) {
		if (error.name == "TypeError") {
			console.error(
				"Error: Make sure the message element is the input's id with '_msg'. (ex. firstname_msg) "
			);
		} else {
			console.error(error.message);
		}
	}
};

const invalid = (elem, msg = null) => {
	try {
		elem.classList.remove("is-valid");
		elem.classList.add("is-invalid");
		document.getElementById(`${elem.id}_msg`).classList.remove("text-success");
		document.getElementById(`${elem.id}_msg`).classList.add("text-danger");
		document.getElementById(`${elem.id}_msg`).innerHTML = msg ? msg : "Invalid";
	} catch (error) {
		if (error.name == "TypeError") {
			console.error(
				"Error: Make sure the message element is the input's id with '_msg'. (ex. firstname_msg) "
			);
		} else {
			console.error(error.message);
		}
	}
};
