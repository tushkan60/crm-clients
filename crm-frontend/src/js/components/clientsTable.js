import GraphModal from "graph-modal";
let dir = true;
let tempList = [];
let clientData;
let timerId;
const pageBody = document.querySelector(".page__body");
const modalContainer = document.querySelector(".graph-modal");
const addForm = document.querySelector(".modals__form-new");
const editForm = document.querySelector(".modals__form-edit");
const filterForm = document.querySelector(".header__form");
const addClientName = document.getElementById("newName");
const addClientSurname = document.getElementById("newSurname");
const addClientFatherName = document.getElementById("newFathername");
const contactsListNew = document.querySelector(".modals__contact-new");
const contactsListEdit = document.querySelector(".modals__contact-edit");
const addNewContact = document.getElementById("addNewContact");
const editNewContact = document.getElementById("editNewContact");
const clientTable = document.querySelector(".table__body");
const editClientName = document.getElementById("editName");
const editClientSurname = document.getElementById("editSurname");
const editClientFatherName = document.getElementById("editFathername");
const editClientId = document.querySelector(".modals__subtitle-id");
const deleteClient1 = document.querySelector(".modals__delete-1");
const deleteClient2 = document.querySelector(".modals__delete-2");
const idColumn = document.querySelector(".table__id");
const surnameColumn = document.querySelector(".table__fullname");
const createColumn = document.querySelector(".table__create");
const updateColumn = document.querySelector(".table__change");
const clientsFilterField = document.getElementById("searchInput");
const apiLink = "http://localhost:3002/api/clients";;
const idSort = document.querySelector(".id__sort");
const fullnameSort = document.querySelector(".fullname__sort");
const letterSort = document.querySelectorAll(".letter-sort");
const createSort = document.querySelector(".create__sort");
const updateSort = document.querySelector(".change__sort");
const addClientError = document.querySelector(".modals__error-add");
const editClientError = document.querySelector(".modals__error-edit");
const deleteClientError = document.querySelector(".modals__error-del");

async function fetchAndRenderClients(property) {
  clientTable.innerHTML = "";
  const request = await fetch(apiLink);
  const clientsItemList = await request.json();
  tableSorting(clientsItemList, property, (dir = !dir));
  clientsItemList.forEach((client) => {
    getNewClient(client);
  });
  tempList = [...clientsItemList];
  return tempList;
}

fetchAndRenderClients("id");

async function handleDeleteClick(array) {
  const response = await fetch(`${apiLink}/${array.id}`, {
    method: "DELETE",
  });
  return {
    response: response,
  };
}

async function uploadClient(contactsArr) {
  clientTable.innerHTML = "";
  const response = await fetch(apiLink, {
    method: "POST",
    body: JSON.stringify({
      name: addClientName.value,
      surname: addClientSurname.value,
      lastName: addClientFatherName.value,
      contacts: contactsArr,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return {
    response: response,
  };
}

async function updateClient(array, contactsArr) {
  clientTable.innerHTML = "";
  const response = await fetch(`${apiLink}/${array.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: editClientName.value,
      surname: editClientSurname.value,
      lastName: editClientFatherName.value,
      contacts: contactsArr,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return {
    response: response,
  };
}

function tableSorting(clientsObj, property, dir = false) {
  return clientsObj.sort((a, b) => {
    let dirIf = a[property] < b[property];
    if (dir === true) dirIf = a[property] > b[property];
    if (dirIf === true) return -1;
  });
}

function tableFilter(
  clientsObj,
  filterColumn,
  property1,
  property2,
  property3
) {
  const result = [];
  const copy = [...clientsObj];
  for (const client of copy) {
    if (client[property1].includes(filterColumn.value) === true)
      result.push(client);
    if (client[property2].includes(filterColumn.value) === true)
      result.push(client);
    if (client[property3].includes(filterColumn.value) === true)
      result.push(client);
  }
  return result.filter((number, index, numbers) => {
    return result.indexOf(number) === index;
  });
}

function addContact(element) {
  if (element.childElementCount < 10) {
    const contact = document.createElement("div");
    contact.classList.add("contact__item", "input-group", "mb-4");
    contact.innerHTML = `
      <select class="contact__select form-select" aria-label="Example select with button addon">
        <option selected value="phone">Телефон</option>
        <option value="mail">Email</option>
        <option value="vk">Vk</option>
        <option value="fb">Facebook</option>
        <option value="person">Другое</option>
      </select>
      <input type="text" class="contact__input form-control" placeholder="Введите данные контакта" required/>
      <button class="contact__delete btn btn-outline-secondary" type="button">X</button>`;
    element.appendChild(contact);
  }
}

addNewContact.addEventListener("click", () => addContact(contactsListNew));
editNewContact.addEventListener("click", () => addContact(contactsListEdit));

function ContactDelete(event) {
  if (event.target.classList.contains("contact__delete")) {
    event.target.parentElement.remove();
  }
}

contactsListNew.addEventListener("click", ContactDelete);
contactsListEdit.addEventListener("click", ContactDelete);

function getTooltip() {
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function findSelectedValue(type) {
  const typeToValue = {
    phone: "Телефон",
    mail: "Email",
    vk: "Vk",
    fb: "Facebook",
    person: "Другое",
  };
  return typeToValue[type] || "";
}

function getNewClient(array) {
  const clientString = document.createElement("tr");
  const clientId = document.createElement("td");
  const clientFullname = document.createElement("td");
  const clientCreate = document.createElement("td");
  const clientCreateDate = document.createElement("span");
  const clientCreateTime = document.createElement("span");
  const clientChange = document.createElement("td");
  const clientChangeDate = document.createElement("span");
  const clientChangeTime = document.createElement("span");
  const clientContacts = document.createElement("td");
  const clientActions = document.createElement("td");
  const deleteButton = document.createElement("button");
  const editButton = document.createElement("button");
  const createDate = new Date(array.createdAt);
  const createDay = createDate.getDate().toString().padStart(2, "0");
  const createMonth = (createDate.getMonth() + 1).toString().padStart(2, "0");
  const createYear = createDate.getFullYear().toString();
  const createHours = createDate.getHours().toString().padStart(2, "0");
  const createMinutes = createDate.getMinutes().toString().padStart(2, "0");
  const updatedDate = new Date(array.updatedAt);
  const updatedDay = updatedDate.getDate().toString().padStart(2, "0");
  const updatedMonth = (updatedDate.getMonth() + 1).toString().padStart(2, "0");
  const updatedYear = updatedDate.getFullYear().toString();
  const updatedHours = updatedDate.getHours().toString().padStart(2, "0");
  const updatedMinutes = updatedDate.getMinutes().toString().padStart(2, "0");

  clientString.classList.add("body__string");
  clientId.classList.add("body__id");
  clientId.innerText = array.id;
  clientFullname.classList.add("body__fullname");
  clientFullname.innerText = `${array.surname} ${array.name} ${array.lastName}`;
  clientCreateDate.classList.add("mx-2", "body__date");
  clientCreateDate.innerText = `${createDay}.${createMonth}.${createYear}`;
  clientCreateTime.classList.add("mx-2", "body__time");
  clientCreateTime.innerText = `${createHours}:${createMinutes}`;
  clientChangeDate.classList.add("mx-2", "body__date");
  clientChangeDate.innerText = `${updatedDay}.${updatedMonth}.${updatedYear}`;
  clientChangeTime.classList.add("mx-2", "body__time");
  clientChangeTime.innerText = `${updatedHours}:${updatedMinutes}`;
  clientContacts.classList.add("body__contacts");
  array.contacts.forEach(({ type, value }) => {
    findSelectedValue(type);
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("btn", "btn-reset", "mx-1");
    button.setAttribute("data-bs-toggle", "tooltip");
    button.setAttribute("data-bs-placement", "top");
    button.setAttribute(
      "data-bs-original-title",
      `${findSelectedValue(type)}: ${value}`
    );
    button.innerHTML = `<img loading="lazy" src="/img/${type}.svg" alt="${type}">`;
    clientContacts.appendChild(button);
  });

  deleteButton.classList.add("table__btn-delete", "btn");
  deleteButton.setAttribute("data-graph-path", "deleteClient");
  deleteButton.innerText = "Удалить";
  editButton.classList.add("table__btn-edit", "btn");
  editButton.setAttribute("data-graph-path", "editClient");
  editButton.innerText = "Изменить";
  clientActions.append(editButton, deleteButton);
  clientCreate.append(clientCreateDate, clientCreateTime);
  clientChange.append(clientChangeDate, clientChangeTime);
  clientString.append(
    clientId,
    clientFullname,
    clientCreate,
    clientChange,
    clientContacts,
    clientActions
  );
  clientTable.append(clientString);
  getTooltip();

  deleteButton.addEventListener("click", () => {
    new GraphModal().open("deleteClient");
    clientData = { ...array };
    return clientData;
  });

  editButton.addEventListener("click", () => {
    new GraphModal().open("editClient");
    clientData = { ...array };
    editClientId.innerHTML = `ID: ${array.id}`;
    editClientSurname.value = array.surname;
    editClientName.value = array.name;
    editClientFatherName.value = array.lastName;
    contactsListEdit.innerHTML = "";
    array.contacts.forEach(({ type, value }) => {
      findSelectedValue(type);
      const contact = document.createElement("div");
      contact.classList.add("contact__item", "input-group", "mb-4");
      contact.innerHTML = `
      <select class="contact__select form-select"  aria-label="Example select with button addon">
        <option selected value="${type}">${findSelectedValue(type)}</option>
        <option value="phone">Телефон</option>
        <option value="mail">Email</option>
        <option value="vk">Vk</option>
        <option value="fb">Facebook</option>
        <option value="person">Другое</option>
      </select>
      <input type="text" class="contact__input form-control" placeholder="Введите данные контакта" value="${value}" required/>
      <button class="contact__delete btn btn-outline-secondary" type="button">X</button>`;
      contactsListEdit.appendChild(contact);
    });
    return clientData;
  });
}

editForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const contactType = document.querySelectorAll(".contact__select");
  const contactValue = document.querySelectorAll(".contact__input");
  if (
    editClientName.value &&
    editClientSurname.value &&
    (contactsListEdit.childElementCount === 0 ||
      Array.from(contactValue).every((input) => input.value.trim() !== ""))
  ) {
    let contactsArr = [];
    contactType.forEach(function (type, index) {
      contactsArr.push({
        type: type.value,
        value: contactValue[index].value,
      });
    });
    fetch(apiLink)
      .then(async (response) => {
        if (response.ok) {
          const updateResult = await updateClient(clientData, contactsArr);
          if (updateResult.response.ok) {
            clientTable.innerHTML = "";
            modalContainer.classList.remove("is-open");
            pageBody.classList.remove("disable-scroll");
            await fetchAndRenderClients();
          } else {
            editClientError.innerHTML = `Ошибка: ${updateResult.response.status} - ${updateResult.response.statusText}`;
          }
        } else {
          editClientError.innerHTML = `Нет подключения к серверу`;
        }
      })
      .catch((error) => {
        editClientError.innerHTML = `Нет подключения к серверу`;
      });
  }
});

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const contactType = document.querySelectorAll(".contact__select");
  const contactValue = document.querySelectorAll(".contact__input");
  if (
    addClientName.value &&
    addClientSurname.value &&
    (contactsListNew.childElementCount === 0 ||
      Array.from(contactValue).every((input) => input.value.trim() !== ""))
  ) {
    let contactsArr = [];
    contactType.forEach(function (type, index) {
      contactsArr.push({
        type: type.value,
        value: contactValue[index].value,
      });
    });
    fetch(apiLink)
      .then(async (response) => {
        if (response.ok) {
          const uploadResult = await uploadClient(contactsArr);

          if (uploadResult.response.ok) {
            clientTable.innerHTML = "";
            addClientName.value = "";
            addClientSurname.value = "";
            addClientFatherName.value = "";
            contactsListNew.innerHTML = "";
            modalContainer.classList.remove("is-open");
            pageBody.classList.remove("disable-scroll");
            await fetchAndRenderClients();
          } else {
            const data = await uploadResult.response.json();
            function showErrors() {
              const errorMessages = data.errors.map((error) => error.message);
              return errorMessages.join("<br>");
            }

            addClientError.innerHTML = `Ошибка: ${
              uploadResult.response.status
            } - ${
              uploadResult.response.statusText
            } <br><div>${showErrors()}</div>`;
          }
        } else {
          addClientError.innerHTML = `Нет подключения к серверу`;
        }
      })
      .catch((error) => {
        addClientError.innerHTML = `Нет подключения к серверу`;
      });
  }
});

deleteClient1.addEventListener("click", async function () {
  fetch(apiLink)
    .then(async (response) => {
      if (response.ok) {
        const deleteResult = await handleDeleteClick(clientData);
        if (deleteResult.response.ok) {
          clientTable.innerHTML = "";
          await fetchAndRenderClients();
          modalContainer.classList.remove("is-open");
          pageBody.classList.remove("disable-scroll");
        } else {
          editClientError.innerHTML = `Ошибка: ${deleteResult.response.status} - ${deleteResult.response.statusText}`;
        }
      } else {
        editClientError.innerHTML = `Нет подключения к серверу`;
      }
    })
    .catch((error) => {
      editClientError.innerHTML = `Нет подключения к серверу`;
    });
});

deleteClient2.addEventListener("click", async function () {
  fetch(apiLink)
    .then(async (response) => {
      if (response.ok) {
        const deleteResult = await handleDeleteClick(clientData);
        if (deleteResult.response.ok) {
          clientTable.innerHTML = "";
          await fetchAndRenderClients();
          modalContainer.classList.remove("is-open");
          pageBody.classList.remove("disable-scroll");
        } else {
          deleteClientError.innerHTML = `Ошибка: ${deleteResult.response.status} - ${deleteResult.response.statusText}`;
        }
      } else {
        deleteClientError.innerHTML = `Нет подключения к серверу`;
      }
    })
    .catch((error) => {
      deleteClientError.innerHTML = `Нет подключения к серверу`;
    });
});

idColumn.addEventListener("click", function () {
  idSort.classList.toggle("sort__active");
  fetchAndRenderClients("id");
});
surnameColumn.addEventListener("click", function () {
  fullnameSort.classList.toggle("sort__active");
  letterSort.forEach((toogleClass) => {
    toogleClass.classList.toggle("d-none");
  });
  fetchAndRenderClients("surname");
});
createColumn.addEventListener("click", function () {
  createSort.classList.toggle("sort__active");
  fetchAndRenderClients("createdAt");
});
updateColumn.addEventListener("click", function () {
  updateSort.classList.toggle("sort__active");
  fetchAndRenderClients("updatedAt");
});

filterForm.addEventListener("input", function (event) {
  clearTimeout(timerId);
  timerId = setTimeout(async function () {
    await fetchAndRenderClients("id");
    let filtredList = [...tempList];

    filtredList = tableFilter(
      filtredList,
      clientsFilterField,
      "name",
      "surname",
      "lastName"
    );

    clientTable.innerHTML = "";
    filtredList.forEach((client) => {
      getNewClient(client);
    });
  }, 300);
});
