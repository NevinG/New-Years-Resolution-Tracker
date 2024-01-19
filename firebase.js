const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const signInButton = document.getElementById("sign-in-button");
const signOutButton = document.getElementById("sign-out-button");
const viewProfileButton = document.getElementById("view-profile-button");

const profileContainer = document.getElementById("profile-container");
const appContainer = document.getElementById("app-container");
const backToHomeButton = document.getElementById("back-to-home-button");
const deleteAccountButton = document.getElementById("delete-account");
const deleteUserDataButton = document.getElementById("delete-user-data");
const signOutButton2 = document.getElementById("sign-out-2")

signInButton.onclick = () => {auth.signInWithPopup(provider);}
signOutButton.onclick = () => {auth.signOut();}
signOutButton2.onclick = () => {auth.signOut(); toHomeDisplay();}

viewProfileButton.onclick = toProfileDisplay;
backToHomeButton.onclick = toHomeDisplay;

deleteAccountButton.onclick = async () => {
    await deleteData();

    let user = firebase.auth().currentUser;
    user.delete();
}

deleteUserDataButton.onclick = async () => await deleteData();

auth.onAuthStateChanged(user => {
    if(user){
        signInButton.style.display = "none";
        signOutButton.style.display = "block";
        viewProfileButton.style.display = "block";
        toHomeDisplay();
    }else{
        signInButton.style.display = "block";
        signOutButton.style.display = "none";
        viewProfileButton.style.display = "none";
        toHomeDisplay();
    }
});

const db = firebase.firestore();

async function deleteData(){
    let user = firebase.auth().currentUser;
    if(user){
        const docRef = db.collection('users').doc(user.uid);
        docRef.delete();
        retrieveGoals();
    }
}

function toHomeDisplay(){
    profileContainer.style.display = "none";
    appContainer.style.display = "block";
}

function toProfileDisplay(){
    profileContainer.style.display = "block";
    appContainer.style.display = "none";
}