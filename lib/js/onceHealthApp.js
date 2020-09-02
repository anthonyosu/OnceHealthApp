// Once Health App - Demo landing page
// Web page code by Anthony G. www.anthony.media
// ==============================================
// App Concept by Cory Feldman & James Wallace

// APP states
let appState = {
    "currentView": "view-landing",
    "previousView": null,
    "active_patient": {
        'first': 'John',
        'last': "Smith",
        'age': 67,
        'rrs': 5,
        'dob': 19670811,
        'high-risk': false,
        'gender': 'male',
        'avatar': null
    }
}

//---------------------------------
function toggleModal(){
	document.querySelector(".menu-modal").classList.toggle("hide");
}
//---------------------------------
function renderModal(title, subtext){
    // This function takes two values passed as strings and updates the modal content

    // change the title
    document.querySelector(".menu-modal-header").textContent = title;
    // change the subtext
    document.querySelector(".menu-modal-subtext").textContent = subtext;
}
//---------------------------------
function viewControl(view){
    // hide all views
    hideViews();
    // update state
    appState["previousView"] = appState["currentView"];
    appState["currentView"] = view;

    // show selected view
    document.querySelector("."+view).classList.remove("hide");

    // add event listner to btn
    document.querySelector("." +appState["currentView"] +" #cta-quit").addEventListener("click", back);
};
//---------------------------------
function loading(){
    // Get the list of questions 
    let questions = getQuestionNames();
    let displayQs = [];
    let message = document.querySelector("#loading-flashing-text");
    let progressBar = document.querySelector("#loading-progress-bar");
    let submitBtn = document.querySelector("#cta-loading-get-score");
    let backBtn = document.querySelector(".view-loading .cta-quit");
    let loadingIcon = document.querySelector(".view-loading .container .loading-icon");

    // always hide the submit button
    if(submitBtn){
        submitBtn.classList.add("hide");
    }
    // always hide back button
    if(backBtn){
        backBtn.classList.add("hide");
    }
    // always show loading icon
    // change loading icon
    loadingIcon.classList.add("ri-settings-3-line");
    loadingIcon.classList.remove("ri-shield-check-fill");
    loadingIcon.classList.add("rotating");


    for(const q of questions){
        clean_q = q.split('-').join(" ");
        clean_q = clean_q.replace('history ','');
        clean_q = clean_q[0].toUpperCase() + clean_q.slice(1);
        displayQs.push(clean_q);
    }
    let counter = 1;
    let divider = (100 / displayQs.length);
    let progressValue = 0;

    let questionDisplay = setInterval(function(){
        counter++;
        message.innerHTML = "Analyzing " + displayQs[counter] + " response";
        // update the progress bar
        progressValue = progressValue + divider;
        progressBar.value = progressValue;

        // End on the last question
        if(counter == (displayQs.length)-1) {
            clearInterval(questionDisplay);
            // set progress bar to 100
            progressBar.value = 100;

            // change loading icon
            loadingIcon.classList.remove("ri-settings-3-line");
            loadingIcon.classList.add("ri-shield-check-fill");
            loadingIcon.classList.remove("rotating");

            message.innerHTML = "Score ready to view.";
            // Display the view score button
            submitBtn.classList.remove("hide");

            // Reveal the back btn
            backBtn.classList.remove("hide");
        }
    }, 500);
}
//---------------------------------
function getQuestionNames(){
    // this function returns a set of all the questions
    // get all questions
    let questionNames = document.querySelectorAll(".view-manual-enter input");

    // add names to set
    let cleanNames = new Set();
    for(const q of questionNames){
        cleanNames.add(q.name)
    }
    return cleanNames;
};
//---------------------------------
function checkManualEnterValidation(){
    // this function checks that all questions are answered
    let surveyStatus = true;
    let questions = getQuestionNames();
    let temp = '';
    let counter = 0;
    
    // check all the questions
    for(const q of questions){
        counter++;
        temp = document.querySelectorAll("input[name='"+q+"']");

        tempArr = [];
        for(const option of temp){
            if(option.checked){
                tempArr.push("answered");
            } else {
                tempArr.push("empty");
            }      
        }
        console.log("Q "+counter+": Array = ["+tempArr+"]");

        if(!tempArr.includes("answered")){
            surveyStatus = false;
            console.log("Q "+counter+": not answered - marked as false");
            return surveyStatus;
        }
    }
    return surveyStatus;
}
//---------------------------------
function calcScore(){
    // get question names
    let cleanNames = getQuestionNames();

    // tally up the score
    let score = 0;
    

    for(const questionName of cleanNames){
        // reset the temp binding
        let temp = false;

        // check if a response given
        try {    
            temp = Number(document.querySelector("input[name='"+questionName+"']:checked").value);
        } catch(err) {
            // handle the error if no response given
        }
        if(temp){
            // add the response to the score
            score = score + temp;
        }
    }

    // return the score
    return score;
};
//---------------------------------
function back(){
    viewControl(this.getAttribute('data-back'));
}
//---------------------------------
function hideViews(){
    let views = document.querySelectorAll(".view");
    for (const appView of views) {
        appView.classList.add("hide");
    }
}

//---------------------------------
// Event listeners

// Menu btns 

// rrs btn
document.querySelector("#nav-link-rrs").addEventListener("click", function(){
    renderModal("Learn about RRS", "A Readmission Reduction Score is determined by analyzing data on 21 elements from patients’ electronic health records to determine the risk of readmission and intervention steps.")
    toggleModal();
});
// About btn
document.querySelector("#nav-link-about").addEventListener("click", function(){
    renderModal("About Once Health App", "This landing page is for demonstration purposes only. This page is a theoretical representation of how the Once software application would look and feel if fully developed and deployed in the real world. This project is a material representation by contestants Cory Feldman, FAU and James Wallace, USF, for their submission idea of the Florida Blue Health Innovation Challenge.")
    toggleModal();
});
// Hide menu modal
document.querySelector("#menu-modal-dissmiss").addEventListener("click", function(){
    toggleModal();
});

// -------------------------------------
function leaveHome(){
    // remove background-color
    document.querySelector(".app").classList.remove("blue-background");
    document.querySelector("body").classList.remove("blue-background");

    // logo white
    document.querySelector(".logo").classList.remove("white-logo");

    // reveal footer and menu
    document.querySelector(".menu").classList.remove("hide");
    document.querySelector("footer").classList.remove("hide");
};
// =============================================================
// Views

// Home view
// document.querySelector("#cta-home").addEventListener("click", function(){
//     leaveHome();

//     viewControl("view-landing");
// });

// Calculate view
document.querySelector("#cta-patient").addEventListener("click", function(){
    leaveHome();
    viewControl("view-patient-landing");
});
// Patient > Survey
document.querySelector("#cta-patient-survey").addEventListener("click", function(){
    viewControl("view-manual-enter-2");
});

// Provider Portal View
document.querySelector("#cta-doctor").addEventListener("click", function(){
    leaveHome();
    viewControl("view-provider-portal");
});
// Provider Patient High Risk Results
document.querySelector("#btn-high-risk-results").addEventListener("click", function(){
   viewControl("view-patient-high-risk-steps")
});
// Provider Patient High Risk Results 2
document.querySelector("#btn-patient-high-risk-1").addEventListener("click", function(){
   viewControl("view-patient-matrix");
//    viewControl("view-patient-high-risk-steps-2");
});
// Provider Patient High Risk Results 2
document.querySelector("#btn-high-risk-results-2").addEventListener("click", function(){
//    viewControl("view-patient-matrix");
   viewControl("view-patient-high-risk-steps-2");
});
// Provider Patient High Risk Thank You
document.querySelector("#btn-patient-high-risk-2").addEventListener("click", function(){
   viewControl("view-thank-you-provider-high-risk");
});
// Manual Enter View
document.querySelector("#cta-manual-enter").addEventListener("click", function(){
    viewControl("view-manual-enter-2");
});
// Loading view manual
document.querySelector("#cta-manual-enter-submit").addEventListener("click", function(){
    viewControl("view-manual-enter-2");
    document.querySelector(".view-loading .cta-quit").setAttribute("data-back", "view-manual-2");

    // // check if all answers are submitted
    // if(checkManualEnterValidation()) {
    //     viewControl("view-manual-enter-2");
    //     loading();
    //     // set back btn
    //     // change back backBtn
    //     document.querySelector(".view-loading .cta-quit").setAttribute("data-back", "view-manual-2");
    // } else {
    //     console.log("answers all qs")
    //     document.querySelector(".view-manual-enter .flash-message-text").classList.remove("hide");
    // }
});
// Thank you view manual
document.querySelector("#cta-manual-enter-2-submit").addEventListener("click", function(){
    viewControl("view-thank-you-patient");
    // // check if all answers are submitted
    // if(checkManualEnterValidation()) {
    //     viewControl("view-manual-enter-2");
    //     loading();
    //     // set back btn
    //     // change back backBtn
    //     document.querySelector(".view-loading .cta-quit").setAttribute("data-back", "view-manual-2");
    // } else {
    //     console.log("answers all qs")
    //     document.querySelector(".view-manual-enter .flash-message-text").classList.remove("hide");
    // }
});
// Loading view import allow
document.querySelector(".modal-submit-allow").addEventListener("click", function(){
    // check if response given
    let validate = false;
    try {
        validate = document.querySelector("input[name='share-data-medicare']:checked");
    } catch(err) {
        // pass
    }
    if(validate){
        document.querySelector(".modal-option-group").classList.remove("modal-option-group-validate");
        viewControl("view-loading");
        loading();
    } else {
        document.querySelector(".modal-option-group").classList.add("modal-option-group-validate");
    }
});
// Import BB view
document.querySelector("#cta-import-bb").addEventListener("click", function(){
    viewControl("view-import-bb");
    // add event listener to deny btn
    document.querySelector(".modal-submit-deny").addEventListener("click", back);

    // change back backBtn
    document.querySelector(".view-loading .cta-quit").setAttribute("data-back", "view-import-bb");
});

// function to get active patient
function getPatientData(selector) {
    temp = document.querySelector(selector);
    console.log(temp);
    appState["active_patient"]['first'] = temp.getAttribute("data-first");
    appState["active_patient"]['last'] = temp.getAttribute("data-last");
    appState["active_patient"]['dob'] = temp.getAttribute("data-dob");
    appState["active_patient"]['age'] = temp.getAttribute("data-age");
    appState["active_patient"]['rrs'] = temp.getAttribute("data-rrs");
    appState["active_patient"]['high-risk'] = temp.getAttribute("data-high-risk");
    appState["active_patient"]['gender'] = temp.getAttribute("data-gender");
    appState["active_patient"]['avatar'] = temp.getAttribute("data-avatar");
}
// Function to update the patient scorecard page data
function updatePatientScorePage(){
    document.querySelector("#provider-patient-data-first").innerHTML = appState["active_patient"]['first'];
    document.querySelector("#provider-patient-data-last").innerHTML = appState["active_patient"]['last'];
    document.querySelector("#provider-patient-data-age").innerHTML = appState["active_patient"]['age'];
    document.querySelector("#provider-patient-data-dob").innerHTML = appState["active_patient"]['dob'];
    document.querySelector("#provider-patient-data-rrs").textContent = appState["active_patient"]['rrs'];
    document.querySelector("#scorecard-patient-full-name").textContent = (appState["active_patient"]['first'] + " " + appState["active_patient"]['last']);
    document.querySelector(".view-provider-scorecard .meta-identity-avatar").src = appState["active_patient"]['avatar'];

    // Generic avatars
    // if (appState["active_patient"]['gender'] == "female") {
    //     document.querySelector(".view-provider-scorecard .meta-identity-avatar").setAttribute("src", "./static/img/avatar_female.svg");
    // } else {
    //     document.querySelector(".view-provider-scorecard .meta-identity-avatar").setAttribute("src", "./static/img/avatar_male.svg");

    // }
    if (appState["active_patient"]['high-risk'] === 'true'){
        document.querySelector(".scorecard-cta-low-risk").classList.add("hide");
        document.querySelector(".scorecard-cta-high-risk").classList.remove("hide");
        document.querySelector(".scorecard-data-points-high-risk").classList.remove("hide");
    } else {
        document.querySelector(".scorecard-cta-low-risk").classList.remove("hide");
        document.querySelector(".scorecard-cta-high-risk").classList.add("hide");
        document.querySelector(".scorecard-data-points-low-risk").classList.remove("hide");
        document.querySelector(".scorecard-data-points-high-risk").classList.add("hide");
        document.querySelector("#scorecard-patient-full-name-low-risk").innerHTML = (appState["active_patient"]['first'] + " " + appState["active_patient"]['last']);
    }
    // if high risk
    //document.querySelector("#provider-patient-data-high-risk").innerHTML = appState["active_patient"]['high-risk'];
}
// Provider Patient views event listeners
document.querySelector(".provider-patient-row[data-patient-id='001']").addEventListener("click", function(){
    // update the active patient
    getPatientData(".provider-patient-row[data-patient-id='001']");
    // render the html
    updatePatientScorePage();
    //Show scorecard
    viewControl("view-provider-scorecard");
});
document.querySelector(".provider-patient-row[data-patient-id='002']").addEventListener("click", function(){
    // update the active patient
    getPatientData(".provider-patient-row[data-patient-id='002']");
    // render the html
    updatePatientScorePage();
    //Show scorecard
    viewControl("view-provider-scorecard");
});
document.querySelector(".provider-patient-row[data-patient-id='003']").addEventListener("click", function(){
    // update the active patient
    getPatientData(".provider-patient-row[data-patient-id='003']");
    // render the html
    updatePatientScorePage();
    //Show scorecard
    viewControl("view-provider-scorecard");
});
document.querySelector(".provider-patient-row[data-patient-id='004']").addEventListener("click", function(){
    // update the active patient
    getPatientData(".provider-patient-row[data-patient-id='004']");
    // render the html
    updatePatientScorePage();
    //Show scorecard
    viewControl("view-provider-scorecard");
});
