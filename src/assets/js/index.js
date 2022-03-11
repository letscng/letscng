  window.onload = function() {


    const firebaseConfig = {
        apiKey: 'AIzaSyBd9AIpEXU-jfkp40JlCi0N34QiqHS7wW0',
        authDomain: 'challenge1177.firebaseapp.com',
        projectId: 'challenge1177',
        storageBucket: 'challenge1177.appspot.com',
        messagingSenderId: '59705937323',
        appId: '1:59705937323:web:ad08088c36a47b498a16ee',
        measurementId: 'G-3RTR8FHR1H',
        databaseURL: "https://challenge1177-default-rtdb.firebaseio.com/",
      };
      
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      
      // Firebase Database references.
      var db = firebase.firestore();
      var registerationDB = db.collection('registeration');

      
      // FirebaseUI config
      var uiConfig = {
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        signInOptions: [
          // Email / Password Provider.
          // firebase.auth.EmailAuthProvider.PROVIDER_ID,
          // firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD
          {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            recaptchaParameters: {
              type: 'image', // 'audio'
              size: 'normal', // 'invisible' or 'compact'
              badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
            },
            defaultCountry: 'IN',
            defaultNationalNumber: '9876543210',
            loginHint: '+919876543210'
          }

        ],
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // console.log(authResult);
            // Handle sign-in.
            var isNewUser = authResult.additionalUserInfo.isNewUser;
      
            if (isNewUser) {
              // Only add new users to the guestbook.
              registerationDB.doc(firebase.auth().currentUser.phoneNumber).set({
                message: 'CREATE',
                timestamp: Date.now(),
                name: authResult.user.displayName,
                uid: authResult.user.uid
              });
            }
            // Change login button to logout
            $("#login-button").addClass("d-none");
            $("#logout-button").removeClass("d-none");
            document.getElementById("profile-nav").click();

            // Return false to avoid redirect.
            return false;
          }
        }
      };

      document.getElementById("logout-button").addEventListener('click', function(){
        if (firebase.auth().currentUser) {
          // User is signed in, let's sign out
          firebase.auth().signOut();
         $("#logout-button").addClass("d-none");
         $("#login-button").removeClass("d-none");
         window.location.href="https://letscng.com";
        } 
      });

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig);

      firebase.auth().onAuthStateChanged(function(user) {
        // console.log("onload");
        if (user) {
          if (firebase.auth().currentUser) {
            $("#login-button").addClass("d-none");
            $("#logout-button").removeClass("d-none");
            profileForm.elements[2].value = firebase.auth().currentUser.phoneNumber;
            registerationDB
              .doc(firebase.auth().currentUser.phoneNumber)
              .get()
              .then(snapshot => {
                let profileData = snapshot.data();
                if(profileData.message == "REGISTERED"){
                  profileForm = document.getElementById("profileForm");
                  profileForm.elements[0].value = profileData.firstName;
                  profileForm.elements[1].value = profileData.lastName;
                  // profileForm.elements[2].value = profileData.number;
                  profileForm.elements[3].value = profileData.dob;
                  profileForm.elements[4].value = profileData.gender;
                  profileForm.elements[5].value = profileData.address;
                  if (profileData.stravaAuth != null) {
                    document.getElementById("stravaAuth").style.display = "none";
                    $("#strava-success-alert").addClass('d-block');
                  } 
                } else if (profileData.message == "CREATE") {
                  if (profileData.stravaAuth != null) {
                    document.getElementById("stravaAuth").style.display = "none";
                    $("#strava-success-alert").addClass('d-block');
                  } 
                }
                
              });
            }
          } else {
            // Make innerhtml of button login
          }
      });

      document.getElementById("profileForm").addEventListener("submit", function(event){
          profileForm = document.getElementById("profileForm");
          // console.log(profileForm.elements);
            // Prevent redirect
            // Add message to DB
            if (firebase.auth().currentUser) {
              registerationDB.doc(firebase.auth().currentUser.phoneNumber).update({
                firstName: profileForm.elements[0].value,
                lastName: profileForm.elements[1].value,
                number: profileForm.elements[2].value,
                dob: profileForm.elements[3].value,
                gender: profileForm.elements[4].value,
                address: profileForm.elements[5].value,
                timestamp: Date.now(),
                name: firebase.auth().currentUser.displayName,
                uid: firebase.auth().currentUser.uid,
                message: 'REGISTERED'
              });
            }

            // Prevent redirect
            event.preventDefault();
      });

      document.getElementById("stravaAuth").addEventListener("click", function(){
        window.location.href =
        'https://www.strava.com/oauth/authorize?client_id=69720&response_type=code&redirect_uri=https://letscng.com/&approval_prompt=force&scope=activity:read_all';
      });

      function getStravaAuth() {
        let currentUrl = window.location.href;
        var url = new URL(currentUrl);
        let code = url.searchParams.get('code');
        let scope = url.searchParams.get('scope');
      
        if (code != null && scope == 'read,activity:read_all') {
              $.post(
                'https://www.strava.com/oauth/token?client_id=69720&client_secret=351a9455b693ef8d71cd00e960860900a68c54df&code=' +
                  code +
                  '&grant_type=authorization_code', // url
                {}, // data to be submit
                function(data, status, jqXHR) {
                  // console.log(data);
                  if (status == 'success') {
                    stravaAuthData = data;
                    setTimeout(function(){ 
                      registerationDB
                      .doc(firebase.auth().currentUser.phoneNumber)
                      .update({ stravaAuth: data })
                      .then({ function(){
                        $("#strava-success-alert").addClass('d-block');
                          }
                        });
                     }, 3000);
                    
                      
                  }
                }
              )
        } else if (code) {
          window.location.href =
            'https://www.strava.com/oauth/authorize?client_id=69720&response_type=code&redirect_uri=https://letscng.com/&approval_prompt=force&scope=activity:read_all';
        }
      }
      getStravaAuth();

      document.getElementById("kge1177nav").addEventListener('click', function(){
        $("#strava-preloader").addClass("d-block");
        $("#RS2021Registered").removeClass("d-block");
        $("#challenge-failure-alert").removeClass("d-block");
        setTimeout(function(){ 
        if (firebase.auth().currentUser){
        // Call Backend api with user auth data
        fetch('https://quickstart-image-bsx6kqq36q-uc.a.run.app/getStravaSummary?id=' + (firebase.auth().currentUser.phoneNumber).substring(1,13) + "&challenge=KGE1177",{
          method: 'GET',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*'
          }
        })
        .then(response => response.json())
        .then(data => {
          $("#strava-preloader").removeClass("d-block");
          setTimeout(function(){ 
          if (!(data["toshowdata"])){
            $("#challenge-failure-alert").addClass("d-block");
          } else {
          $("#1177Registered").addClass("d-block");

          document.getElementById("stravaAuth").style.display = "none";
          $("#strava-success-alert").addClass('d-block');
          
          $("#strava-ride-data-table").bootstrapTable({
            data: data["toshowdata"],
            columns: [[{
              field: 'date',
              sortable: true
            },{},{}]]
          });
          $("#step1").html(data["kmWise"]["25"]);
          $("#step2").html(data["kmWise"]["50"]);
          $("#step3").html(data["kmWise"]["75"]);
          $("#step4").html(data["kmWise"]["100"]);
          $("#step5").html(data["kmWise"]["125"]);
        }
      },100);  
        });
          
        }
      }, 1000);

      });
      document.getElementById("rs2021nav").addEventListener('click', function(){
        $("#strava-preloader").addClass("d-block");
        $("#1177Registered").removeClass("d-block");
        $("#challenge-failure-alert").removeClass("d-block");
        setTimeout(function(){ 
        if (firebase.auth().currentUser){
        // Call Backend api with user auth data
        fetch('https://quickstart-image-bsx6kqq36q-uc.a.run.app/getStravaSummary?id=' + (firebase.auth().currentUser.phoneNumber).substring(1,13) + "&challenge=RS2021",{
          method: 'GET',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*'
          }
        })
        .then(response => response.json())
        .then(data => {
          $("#strava-preloader").removeClass("d-block");
          setTimeout(function(){ 
          if (!(data["toshowdata"])){
            $("#challenge-failure-alert").addClass("d-block");
            
          } else {
            $("#RS2021Registered").addClass("d-block");
              document.getElementById("stravaAuth").style.display = "none";
              $("#strava-success-alert").addClass('d-block');
              $("#rs2021-ride-data-table").bootstrapTable({
                data: data["toshowdata"],
                columns: [[{
                  field: 'date',
                  sortable: true
                },{},{}]]
              });
              $("#step1_rs").html(data["kmWise"]["20"]);
              $("#step2_rs").html(data["kmWise"]["30"]);
              $("#step3_rs").html(data["kmWise"]["40"]);
              $("#step4_rs").html(data["kmWise"]["50"]);
            }
              });
            },100);  
            }
         
            
          }, 1000);
      });

      document.getElementById("kge1177-nav").addEventListener('click', function(){
        if (firebase.auth().currentUser){
          
          // getAll1177Data(createBootstrapTable);
          fetch('https://quickstart-image-bsx6kqq36q-uc.a.run.app/getLeaderBoard',{
            method: 'GET',
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin':'*'
            }
          })
          .then(response => response.json())
          .then(data => {
            
            $("#kge1177-data-table").bootstrapTable({
              data:data,
              columns: [[{},{},{},{},{},{},{
                field: 'totalRides',
                sortable: true
              }]]
            });
          });
        }
      });
}
