const itemCtrl = (() => {
  class Item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }
  let id = 0;
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0,
  };

  return {
    logData: () => {
      return data;
    },
    getItems: () => {
      return data.items;
    },
    deleteItems: () => {
      data.items = [];
      data.totalCalories = 0;
      return true;
    },
    getTotalCalories: () => {
      let total = 0;
      data.items.forEach((item) => {
        total += Number(item.calories);
      });
      data.totalCalories = total;
      return data.totalCalories;
    },
    getElementByid: (id) => {
      let foundItem = null;
      data.items.forEach((item) => {
        if (id === item.id) {
          foundItem = item;
        }
      });
      return foundItem;
    },
    addItem: (name, calories) => {
      id++;
      const newItem = new Item(id, name, Number(calories));
      data.items.push(newItem);
      return newItem;
    },
    setCurrentItem: (current) => {
      data.currentItem = current;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    updatedCalories: () => {
      let total = 0;
      const items = itemCtrl.getItems();
      items.forEach((item) => (total += item.calories));
      return total;
    },
    deleteItem: () => {
      let temp = null;

      data.items.forEach((item, index) => {
        if (item.id === data.currentItem.id) {
          data.items.splice(index, 1);
        }
      });
      console.log(data.items);
    },

    updateItem: (input) => {
      let {name, calories} = input;
      calories = Number(calories);
      let foundItem = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          foundItem = item;
        }
      });
      return foundItem;
    },
  };
})();

const UICtrl = (() => {
  //#item-name
  //#item-calories
  return {
    getFormInput: () => {
      return {
        name: document.querySelector("#item-name").value,
        calories: document.querySelector("#item-calories").value,
      };
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(".total-calories").textContent = totalCalories;
    },
    clearEditState: () => {
      document.querySelector("#item-calories").value = "";
      document.querySelector("#item-name").value = "";
      document.querySelector(".update-btn").style.display = "none";
      document.querySelector(".delete-btn").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
      document.querySelector(".add-btn").style.display = "inline";
    },
    showButtonsOnEdit: () => {
      document.querySelector(".update-btn").style.display = "inline";
      document.querySelector(".delete-btn").style.display = "inline";
      document.querySelector(".back-btn").style.display = "inline";
      document.querySelector(".add-btn").style.display = "none";
    },
    UIupdateCaories: (calories) => {
      document.querySelector(".total-calories").textContent = calories;
    },
    updateUI: (updatedItem) => {
      let listeItemsFromDOM = document.querySelector("#item-list");
      listeItemsFromDOMArray = Array.from(listeItemsFromDOM.children);
      console.log(listeItemsFromDOMArray);
      listeItemsFromDOMArray.forEach((li) => {
        if (`item-${updatedItem.id}` === li.id) {
          li.children[1].textContent = updatedItem.calories;
          li.children[0].textContent = updatedItem.name;
        }
      });
    },
    UIdeleteItem: () => {
      let temp = null;
      const lis = document.querySelector("#item-list").children;
      arrayOfLis = Array.from(lis);

      arrayOfLis.forEach((li) => {
        if (li.id === `item-${itemCtrl.getCurrentItem().id}`) {
          li.remove();
        }
      });
    },
    delteItemsFromUI: () => {
      document.querySelector(".total-calories").textContent = 0;
      let listeItemsFromDOM = document.querySelector("#item-list");
      listeItemsFromDOMArray = Array.from(listeItemsFromDOM.children);
      listeItemsFromDOMArray.forEach((li) => li.remove());
    },
    back: () => {
      document.querySelector("#item-calories").value = "";
      document.querySelector("#item-name").value = "";
      document.querySelector(".update-btn").style.display = "none";
      document.querySelector(".delete-btn").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
      document.querySelector(".add-btn").style.display = "inline";
    },
    addListItem: (item) => {
      const collection = document.querySelector("#item-list");
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;

      li.innerHTML = `<strong>${item.name}</strong>: <em>${item.calories}</em>
      <a href="#" class="secondary-content">
        <i class=" edit-item fa fa-pencil"></i>
      </a>
    </li>`;
      collection.appendChild(li);
    },
    addItemToFormOnUpdate: () => {
      console.log(itemCtrl.getCurrentItem());
      document.querySelector(
        "#item-name"
      ).value = itemCtrl.getCurrentItem().name;
      document.querySelector(
        "#item-calories"
      ).value = itemCtrl.getCurrentItem().calories;
    },

    populateItemList: (items) => {
      let html = "";
      items.forEach((item) => {
        html += ` <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}</strong>: <em>${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
      });
      document.querySelector("#item-list").innerHTML = html;
    },
  };
})();

const App = ((itemCtrl, UICtrl) => {
  // add button event
  // The element gets added when clicking on the add button
  const loadEventListeners = () => {
    document.querySelector(".add-btn").addEventListener("click", (e) => {
      const input = UICtrl.getFormInput();
      if (input.name !== "" && input.calories !== "") {
        const item = itemCtrl.addItem(input.name, input.calories);
        UICtrl.addListItem(item);
        const totalCalories = itemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        document.querySelector("#item-calories").value = "";
        document.querySelector("#item-name").value = "";
      }
      e.preventDefault();
    });
    // Edit icon event
    // when the icon gets clicked the information gets added back to the form
    document.querySelector("#item-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-item")) {
        //get the element we are targeting
        const elemnt = e.target.parentElement.parentElement.id;
        //get the id for the element we are targeting
        const id = elemnt.split("-");
        // pass the id to getElemntById to get the element we are looking for
        const current = itemCtrl.getElementByid(Number(id[1]));
        //set current to the element we clicked and found
        itemCtrl.setCurrentItem(current);
        //we add the iformation to the form after we click on the icon to get them ready to be updated
        UICtrl.addItemToFormOnUpdate();
        //show edit, delete and back buttons when the edit icon clicked
        UICtrl.showButtonsOnEdit();
        e.preventDefault();
      }
    });

    //disable adding when clicking on Enter
    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // update element on clicking on the update meal button
    document.querySelector(".update-btn").addEventListener("click", (e) => {
      const input = UICtrl.getFormInput();
      const updatedItem = itemCtrl.updateItem(input);
      UICtrl.updateUI(updatedItem);
      const updatedCalories = itemCtrl.updatedCalories();
      UICtrl.UIupdateCaories(updatedCalories);
      UICtrl.clearEditState();
      e.preventDefault();
    });

    // clear All
    document.querySelector(".clear-btn").addEventListener("click", () => {
      itemCtrl.deleteItems();
      UICtrl.delteItemsFromUI();
      e.preventDefault();
    });

    //back btn, go back to the inital state
    document.querySelector(".back-btn").addEventListener("click", () => {
      UICtrl.back();
    });
    document.querySelector(".delete-btn").addEventListener("click", () => {
      itemCtrl.deleteItem();
      UICtrl.UIdeleteItem();
      const updatedCalories = itemCtrl.updatedCalories();
      UICtrl.UIupdateCaories(updatedCalories);
      UICtrl.clearEditState();
      e.preventDefault();
    });
  };

  return {
    init: () => {
      const items = itemCtrl.getItems();
      UICtrl.clearEditState();
      UICtrl.populateItemList(items);
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl);

App.init();
