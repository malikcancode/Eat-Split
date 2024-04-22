import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

/// button component

function ButtonComponent({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showForm, setShowForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleForm() {
    setShowForm((showForm) => !showForm);
  }

  function showAddfriend(item) {
    setFriends((friends) => [...friends, item]);
    setShowForm(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowForm(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showForm && <FormFriend showAddfriend={showAddfriend} />}

        <ButtonComponent onClick={handleForm}>
          {showForm ? "Close" : "Add Friend"}
        </ButtonComponent>
      </div>
      {selectedFriend && (
        <SplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

export default App;

// friendlist

function FriendList({ friends, handleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((item) => (
        <Friend
          item={item}
          key={item.id}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ item, handleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === item.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      {item.balance < 0 && (
        <p className="red">
          You owe {item.name} {Math.abs(item.balance)}$
        </p>
      )}
      {item.balance > 0 && (
        <p className="green">
          {item.name} owes you {Math.abs(item.balance)}$
        </p>
      )}
      {item.balance === 0 && <p>You and {item.name} are even</p>}
      <ButtonComponent onClick={() => handleSelection(item)}>
        {isSelected ? "Close" : "Select"}
      </ButtonComponent>
    </li>
  );
}

// formAddFriend

function FormFriend({ showAddfriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    showAddfriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form onSubmit={handleSubmit} className="form-add-friend">
      <label>👫 Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🌆 Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <ButtonComponent>Add</ButtonComponent>
    </form>
  );
}

/// SPLIT BILL COMPONENT

function SplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidyByUser, setpaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidyByUser : "";
  const [whoIsPaying, setwhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidyByUser) return;

    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidyByUser);
  }

  return (
    <form onSubmit={handleSubmit} className="form-split-bill">
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>💰 Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🕴 Your Expense</label>
      <input
        type="text"
        value={paidyByUser}
        onChange={(e) =>
          setpaidByUser(
            Number(e.target.value) > bill ? paidyByUser : Number(e.target.value)
          )
        }
      />
      <label>👬 {selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>😉 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setwhoIsPaying(e.target.value)}
      >
        <option value={"user"}>You</option>
        <option value={"friend"}>{selectedFriend.name}</option>
      </select>
      <ButtonComponent>Split Bill</ButtonComponent>
    </form>
  );
}
