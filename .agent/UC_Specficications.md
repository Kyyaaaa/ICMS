# II. Use Case Specifications

## 1. Public Access

### 1.1 View Home Page

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-01_ View Home Page|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|All|Secondary Actors:|None|
|Description:|Allows all users to access the landing page to view general center information, promotional banners, and contact details|   |   |
|Trigger:|Guest wants to view the Home Page|   |   |
|Preconditions:|PRE-1: The system is accessible via the network.<br><br>PRE-2: The user knows the system URL.|   |   |
|Postconditions:|POST-1: The Home Page UI is fully rendered for guests.<br><br>POST-2: Public CMS data is successfully retrieved and displayed.|   |   |
|Normal Flow:|1.0 View Home Page<br><br>1. The Guest navigates to the system URL.<br>    <br>2. The system retrieves and displays the Home Page including promotional banners and contact details.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|1.0.E1 Server Timeout<br><br>1. If the server fails to respond, the system displays MSG-56: “Internal server error. Please try again later.”<br>    <br>2. The Guest is prompted to refresh the page.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-01, BR-16|   |   |
|Other Information:|Displays the landing page with public CMS data.|   |   |
|Assumptions:|The system URL is accessible and DNS is configured properly..|   |   |

  

### 1.2 View System Announcements

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-02_ View System Announcements|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|All|Secondary Actors:|None|
|Description:|Allows all users to view global news, operational updates, and general announcements broadcasted by the center administration.|   |   |
|Trigger:|Guest wants to view system announcements|   |   |
|Preconditions:|PRE-1: The system contains at least one published public announcement.<br><br>PRE-2: The user is on the system UI.|   |   |
|Postconditions:|POST-1: The list of global announcements is displayed to the user.|   |   |
|Normal Flow:|2.0 View System Announcements<br><br>1. The Guest clicks on “Notifications” in the header.<br>    <br>2. The system retrieves and displays the list of public announcements.|   |   |
|Alternative Flows:|2.1.A1 View announcements with search<br><br>1. The guest fills in the keyword in the search form and enters.<br>    <br>2. The system displays announcements that match the keyword.<br>    <br><br>2.2.A2 View announcements with filter<br><br>1. The Guest selects a date range or category.<br>    <br>2. The system displays announcements that match the filter.|   |   |
|Exceptions:|2.0.E1 No Notifications Found<br><br>1. If there are no announcements, the system displays MSG-35: “The requested data was not found or the record has been deleted.”<br>    <br><br>2.1.E1 Search Yields No Results<br><br>1. If no matches are found, the system displays MSG-35: “The requested data was not found or the record has been deleted.”<br>    <br><br>2.2.E1 Filter Yields No Results<br><br>1. If the filter matches nothing, the system displays MSG-35: “The requested data was not found or the record has been deleted.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-01|   |   |
|Other Information:|Displays global news and operational updates broadcasted by the administration.|   |   |
|Assumptions:|The system contains at least one published announcement to display properly.|   |   |

  

### 1.3 Manage Announcements

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-03_ Manage Announcements|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to publish, edit, or pin critical global news and notifications to the home page for all users to read.|   |   |
|Trigger:|Admin wants to manage announcements|   |   |
|Preconditions:|PRE-1: The user is Authenticated.<br><br>PRE-2: The user has the Admin role.|   |   |
|Postconditions:|POST-1: The announcement is persistently saved.<br><br>POST-2: The announcement is immediately visible to target users.|   |   |
|Normal Flow:|3.0 Manage Announcements<br><br>1. The Admin clicks on “Manage Announcements”.<br>    <br>2. The system displays the announcement list and “Create” button.<br>    <br>3. The Admin clicks “Create” or “Edit” an existing announcement.<br>    <br>4. The Admin edits the announcement details and clicks “Save”.<br>    <br>5. The system saves it and displays MSG-01:”Operation completed successfully.” or MSG-02: “Data has been successfully created.”|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|3.0.E1 Validation Error<br><br>1. If the Admin submits incomplete data, the system displays MSG-16: “Please fill in all required fields.” under the input.<br>    <br>2. The Admin reinports the information and submits again.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-39|   |   |
|Other Information:|Admin can publish, edit, or pin global news.|   |   |
|Assumptions:|The user account has been authorized to perform the function.|   |   |

  
  

## 2. Authentication

### 2.1 Register Account

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-04_ Register Account|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Guest|Secondary Actors:|None|
|Description:|Allows an unregistered guest to provide personal information (name, email, phone number) to create a new Learner account in the system.|   |   |
|Trigger:|Guest wants to register a new account|   |   |
|Preconditions:|PRE-1: The Guest is not currently Authenticated.<br><br>PRE-2: The Guest has access to a valid email address and phone number.|   |   |
|Postconditions:|POST-1: A new user account is created with the “Learner” Role.<br><br>POST-2: The Guest is redirected to the login page.|   |   |
|Normal Flow:|4.0 Register Account<br><br>1. The Guest clicks on the “Sign up” button.<br>    <br>2. The system displays the registration form.<br>    <br>3. The Guest fills in all necessary information: name, email, phone number, password, and confirmation password, then clicks “Register”.<br>    <br>4. The system validates input and creates an account with a Learner role.<br>    <br>5. The system displays MSG-05: “Account registered successfully. Please log in.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|4.0.E1 Identity Duplication <br><br>1. If an email or phone already exists, the system displays MSG-33: “This email is already registered in the system.” or MSG-34: “This phone number already exists in the system.” under the input.<br>    <br>2. The Guest is prompted to use a different email or phone.<br>    <br><br>4.0.E2 Password Mismatch<br><br>1. If passwords don’t match, the system displays MSG-20: “Confirmation password does not match.” under the input.<br>    <br><br>4.0.E3 Validation Error<br><br>1. If invalid format, the system displays MSG-16: “Please fill in all required fields.”, MSG-17: “Invalid email format.”, MSG-18: “The phone number must contain 10 to 11 digits.”, or MSG-19: “Password must have at least 8 characters, including uppercase, lowercase letters, and numbers.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-02, BR-03, BR-06, BR-07|   |   |
|Other Information:|Allows an unregistered guest to create a Learner account.|   |   |
|Assumptions:|The guest provides valid and verified contact information.|   |   |

  

### 2.2 Log In

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-05_ Log In|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff, Admin|Secondary Actors:|Authentication Service|
|Description:|Allows users to authenticate their credentials using a registered system account (username and password) or via Google Single Sign-On (SSO) to access authorized features.|   |   |
|Trigger:|User wants to log into the system|   |   |
|Preconditions:|PRE-1: The User has a registered account or valid Google SSO.<br><br>PRE-2: The User is not currently logged in.|   |   |
|Postconditions:|POST-1: The system establishes an active session for the User.|   |   |
|Normal Flow:|5.0 Log In<br><br>1. The user clicks on the “Log in” button.<br>    <br>2. The system displays the login form.<br>    <br>3. The user inputs their registered Email and Password and clicks “Log in”.<br>    <br>4. The system validates the credentials, authenticates the user, and redirects them to their dashboard.|   |   |
|Alternative Flows:|5.1.A1 Log in with Google SSO<br><br>1. The User clicks "Log in with Google".<br>    <br>2. The system redirects to Google OAuth.<br>    <br>3. The User authorizes the app.<br>    <br>4. The system validates the token and logs the user in.|   |   |
|Exceptions:|5.0.E1 Invalid Credentials:<br><br>1. If the email or password is incorrect, the system displays MSG-26: “Incorrect email or password.” under the input.<br>    <br>2. The User re-enters credentials.<br>    <br><br>5.0.E2 Account Locked: <br><br>1. If the account is locked, the system displays MSG-27: “Your account has been locked. Please contact the administrator.”.<br>    <br>2. The User is advised to contact support.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-05|   |   |
|Other Information:|Authenticates user credentials and establishes a session.|   |   |
|Assumptions:|The system checks if the account is active before allowing login.|   |   |

  

### 2.3 Log Out

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-06_ Log Out|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff, Admin|Secondary Actors:|None|
|Description:|Allows authenticated users to safely terminate their current active session and clear authentication tokens to secure the account.|   |   |
|Trigger:|User wants to log out of the system|   |   |
|Preconditions:|PRE-1: The user is currently authenticated with an active session.|   |   |
|Postconditions:|POST-1: The system terminates the active session.<br><br>POST-2: Authentication tokens are cleared.|   |   |
|Normal Flow:|6.0 Log Out<br><br>1. The user clicks on the profile image in the top right.<br>    <br>2. The system displays a dropdown menu.<br>    <br>3. The User clicks “Logout” (Logout).<br>    <br>4. The system terminates the session, clears tokens, and redirects the user to the login page.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|None|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Safely terminates the session and secures the account.|   |   |
|Assumptions:|The user is directed to the default public landing page after logout.|   |   |

  

### 2.4 Reset Password

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-07_ Reset Password|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff, Admin|Secondary Actors:|Authentication Service|
|Description:|Allows users to request a password reset link or OTP via their registered email address in case they forget their login credentials.|   |   |
|Trigger:|User wants to reset their forgotten password|   |   |
|Preconditions:|PRE-1: The user has previously registered an account with a valid Email.<br><br>PRE-2: The user is not logged in.|   |   |
|Postconditions:|POST-1: An OTP is successfully generated and emailed.<br><br>POST-2: The user password is reset upon successful OTP verification.|   |   |
|Normal Flow:|7.0 Reset Password<br><br>1. The user clicks on “Forget Password” on the login page.<br>    <br>2. The user enters their registered email and clicks “Send OTP”.<br>    <br>3. The system sends OTP and displays MSG-08: “The OTP has been sent to your email.”<br>    <br>4. The user enters the OTP and the new password, then clicks “Confirm”<br>    <br>5. The system validates the OTP and updates the password.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|7.0.E1 Email Not Found: <br><br>1. If email is not registered, the system displays: "Email address not found. Please verify and try again." <br>    <br><br>7.0.E2 Invalid OTP: <br><br>1.  If OTP is incorrect or expired, the system displays MSG-28: “Incorrect or expired OTP.” under the input.<br>    <br>2. The user is prompted to enter a valid OTP or request a new one.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-02, BR-03, BR-04|   |   |
|Other Information:|Allows users to regain access if they forget login credentials.|   |   |
|Assumptions:|The user has access to their registered email inbox.|   |   |

## 3. Profile Management

### 3.1 View Personal Profile

  

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-08_ View Personal Profile|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff, Admin|Secondary Actors:|None|
|Description:|Allows logged-in users to view their own detailed personal information, contact details, and account settings.|   |   |
|Trigger:|User wants to view personal profile details|   |   |
|Preconditions:|PRE-1: The user is Authenticated.<br><br>PRE-2: The user has authorized access to the profile module.|   |   |
|Postconditions:|POST-1: The detailed personal information of the target account is retrieved and displayed.|   |   |
|Normal Flow:|8.0 View Personal Profile<br><br>1. The user clicks on the profile image in the top right.<br>    <br>2. The system displays a dropdown menu.<br>    <br>3. The user clicks on “Personal Profile”.<br>    <br>4. The system fetches and displays the profile data.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|None|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Displays personal information, contact details, and account settings.|   |   |
|Assumptions:|The user’s session is still active and valid.|   |   |

  

### 3.2 Update Personal Profile

  

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-09_ Update Personal Profile|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff, Admin|Secondary Actors:|None|
|Description:|Allows logged-in users to modify their personal contact information, address, and upload a new avatar image.|   |   |
|Trigger:|User wants to update personal profile information|   |   |
|Preconditions:|PRE-1: The User is authenticated and viewing their personal profile.|   |   |
|Postconditions:|POST-1: The system updates the user profile in the database.<br><br>POST-2: The new profile data is visible on the UI.|   |   |
|Normal Flow:|9.0 Update Personal Profile<br><br>1. The user clicks on “Edit Profile” in the profile page.<br>    <br>2. The user edits contact details or uploads a new avatar and clicks “Save”.<br>    <br>3. The system validates the input, updates the database, and displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|9.0.E1 Validation Error<br><br>1. If input is invalid, the system displays MSG-16: “Please fill in all required fields.”, MSG-21: “The uploaded file must be in JPG, PNG, or PDF format.”, or MSG-22: “File size exceeds the 5MB limit.” under the input field.<br>    <br>2. The User reinputs the valid data and submits again.<br>    <br><br>9.0.E2 Original Email Change Attempt<br><br>1. If the user tries to change restricted fields, the system displays MSG-51: “You cannot change the original email without OTP verification.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-06, BR-08, BR-09|   |   |
|Other Information:|Allows the user to modify non-restricted details.|   |   |
|Assumptions:|The uploaded avatar format is supported by the system.|   |   |

  

### 3.3 Change Password

  

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-10_ Change Password|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff, Admin|Secondary Actors:|None|
|Description:|Allows logged-in users to change their current login password by providing the old password and confirming a new one.|   |   |
|Trigger:|User wants to change their current password|   |   |
|Preconditions:|PRE-1: The user is authenticated and initiates a password update.|   |   |
|Postconditions:|POST-1: The system updates the user’s password in the database.<br><br>POST-2: Active sessions are maintained or securely handled.|   |   |
|Normal Flow:|10.0 Change Password<br><br>1. The User navigates to the profile settings and clicks “Change Password”.<br>    <br>2. The User enters the old password, new password, and confirms the new password, then clicks “Save”.<br>    <br>3. The system validates the old password and the new password rules.<br>    <br>4. The system updates the password and displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|10.0.E1 Invalid Old Password<br><br>1. If the old password is incorrect, the system displays an error under the input.<br>    <br>2. The User re-enters the correct old password.<br>    <br><br>10.0.E2 Password Mismatch<br><br>1. If the new password and confirmation do not match, the system displays MSG-20: “Confirmation password does not match.” under the input.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-02, BR-03|   |   |
|Other Information:|Ensures account security by requiring the old password first.|   |   |
|Assumptions:|The User remembers their old password.|   |   |

  

## 4. Account Management

### 4.1 View Accounts

  

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-11_ View Accounts|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Staff, Admin|Secondary Actors:|None|
|Description:|Allows Staff to view and search the list of Learner and Tutor accounts, and Admin to view all accounts across the entire system.|   |   |
|Trigger:|Admin/Staff wants to view the list of accounts|   |   |
|Preconditions:|PRE-1: The Admin/Staff is authenticated.<br><br>PRE-2: The user has authorization to view accounts.|   |   |
|Postconditions:|POST-1: The list of user accounts is displayed based on role permissions.|   |   |
|Normal Flow:|11.0 View Accounts<br><br>1. The Admin/Staff clicks on “Account Management” from the sidebar.<br>    <br>2. The system retrieves and displays the list of user accounts with their basic information.|   |   |
|Alternative Flows:|11.1.A1 View accounts with search<br><br>1. The Admin/Staff fills in the keyword in the search form and enters.<br>    <br>2. The system displays accounts that match the keyword.<br>    <br><br>11.2.A2 View accounts with filter<br><br>1. The Admin/Staff clicks on the column header (Role/Status) and selects a value.<br>    <br>2. The system displays accounts that match the filtered value.|   |   |
|Exceptions:|11.0.E1 No Records<br><br>1. If the database is empty, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.<br>    <br><br>11.1.E1 Search Yields No Results<br><br>1. If no matches are found, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.<br>    <br><br>11.1.E2 Filter Yields No Results<br><br>1. If the filter matches nothing, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Staff can view Learner/Tutor accounts, Admin can view all.|   |   |
|Assumptions:|The system has existing user records.|   |   |

  

### 4.2 Create Account

  

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-12_ Create Account|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Staff, Admin|Secondary Actors:|None|
|Description:|Allows Staff to manually create new Learner or Tutor accounts, and Admin to create accounts for any role including Staff.|   |   |
|Trigger:|Admin/Staff wants to manually create a new account.|   |   |
|Preconditions:|PRE-1: The Admin/Staff is authenticated.<br><br>PRE-2: The user has permission to create accounts.|   |   |
|Postconditions:|POST-1: The new user account is successfully saved in the Database.<br><br>POST-2: The account appears in the user list.|   |   |
|Normal Flow:|12.0 Create Account<br><br>1. The Admin/Staff clicks on “Add Account” in the account management screen.<br>    <br>2.  The system displays a form “Add a new account”.<br>    <br>3. The Admin/Staff fills in account information (Role, Name, Email, Phone, etc.) and clicks “Save”.<br>    <br>4. The system validates the information, creates the account, and displays MSG-02: “Data has been successfully created.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|12.0.E1 Data Conflict<br><br>1. If an email or phone already exists, the system displays MSG-33: “This email is already registered in the system.” or MSG-34: “This phone number already exists in the system.” under the input.<br>    <br>2. The Admin/Staff reinputs valid data.<br>    <br><br>12.0.E2 Target is Admin<br><br>1. If Staff attempts to create an Admin, the system displays MSG-31: “Cannot perform operations on an admin-level account.”.<br>    <br><br>12.0.E3 Admin/Staff clicks “Cancel”<br><br>1. The system turns off the creation form and returns to the View Accounts screen.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-02, BR-03, BR-06, BR-13, BR-39|   |   |
|Other Information:|Staff can create Learner/Tutor; Admin can create any role.|   |   |
|Assumptions:|After the user saves, the information must be updated into the database and display a success message within a second, then redirect to the View Accounts screen.|   |   |

  

### 4.3 Update Account Details

  

|   |   |   |   |
|---|---|---|---|
|UC ID and Name:|UC-13_ Update Account Details|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Staff, Admin|Secondary Actors:|None|
|Description:|Allows Staff to modify Learner or Tutor account information, and Admin to modify any user’s account details across the system.|   |   |
|Trigger:|Admin/Staff wants to modify an existing account.|   |   |
|Preconditions:|PRE-1: The Admin/Staff is authenticated.<br><br>PRE-2: The target user account exists in the system.|   |   |
|Postconditions:|POST-1: The target user account details are updated in the database.|   |   |
|Normal Flow:|13.0 Update Account Details<br><br>1. The Admin/Staff clicks on “Edit” for a specific account.<br>    <br>2. The system displays the screen “Account details”.<br>    <br>3. The Admin/Staff edits the information and clicks “Save”.<br>    <br>4. The system updates the account and displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|13.0.E1 Invalid Information <br><br>1. If validation fails, the system displays MSG-16: “Please fill in all required fields.” under the input.<br>    <br>2. The user reinputs information and submits again.<br>    <br><br>13.0.E2 Admin/Staff clicks on “Cancel”<br><br>1. The system turns off abilities to edit and redirects to view account details.<br>    <br><br>13.0.E2 Target is Admin<br><br>1. If Staff attempts to edit an Admin, the system displays MSG-31: “Cannot perform operations on an admin-level account.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-06, BR-10, BR-13, BR-39|   |   |
|Other Information:|Admin/Staff can update information for accounts; while editing, profiles are locked for concurrent changes.|   |   |
|Assumptions:|After the user saves, the information must be updated into the database and display a success message within a second.|   |   |

  
  
  

### 4.4 Change Account Status

  

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-14_ Change Account Status|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Staff, Admin|Secondary Actors:|None|
|Description:|Allows Staff to activate or suspend Learner and Tutor accounts, and Admin to manage the status of any account in the system.|   |   |
|Trigger:|Admin/Staff wants to activate or suspend an account.|   |   |
|Preconditions:|PRE-1: The Admin/Staff is authenticated.<br><br>PRE-2: The target user account exists.|   |   |
|Postconditions:|POST-1: The target user account status is updated in the database.<br><br>POST-2: Active sessions are invalidated if the account is locked.|   |   |
|Normal Flow:|14.0 Change Account Status<br><br>1. The Admin/Staff clicks on the toggle switch for account status.<br>    <br>2. The system displays a pop-up confirming the status change.<br>    <br>3. The Admin/Staff clicks “Confirm”.<br>    <br>4. The system updates the status and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|14.0.E1 Admin/Staff clicks “Cancel”<br><br>1. The system turns off the confirmation pop-up and cancels the status change.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-05, BR-10, BR-39|   |   |
|Other Information:|Used to suspend access without deleting the data.|   |   |
|Assumptions:|Active accounts are displayed in green with the label ‘Active’, while inactive accounts are shown in red with the label ‘Suspend’.|   |   |

  

## 5. Course Management 

### 5.1 View Courses 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-15 View courses|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin,tutor,staff, learner, guest|Secondary Actors:|None|
|Description:|Allows users to browse, search, and filter the catalog of available offline IELTS training courses offered by the center.|   |   |
|Trigger:|The user selects the Courses menu to view available courses.|   |   |
|Preconditions:|PRE-1: User has successfully accessed the system. <br><br>PRE-2: Courses exist in the database|   |   |
|Postconditions:|POST-1: A list of active courses is displayed to the user.|   |   |
|Normal Flow:|15.0 View Courses<br><br>1. The User clicks on the “Courses” menu.<br><br>2. The system retrieves and displays a grid/list of active courses.<br><br>3. User views course information.|   |   |
|Alternative Flows:|15.1.A1 Search by keyword<br><br>1. The User fills in a keyword in the search form and enters.<br><br>2. The system displays the course list that matches what the User searched.<br><br>15.2.A2 Search by filter<br><br>1. The User clicks on a filter dropdown (e.g. target<br><br>band).<br><br>2. The system displays the course list that matches what the User filtered.|   |   |
|Exceptions:|15.0.E1 There is no matching result<br><br>1. The system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low (Usually done once during onboarding or upon acquiring new certificates).|   |   |
|Business Rules:|BR-01, BR-15|   |   |
|Other Information:|Users can search by course name or code.|   |   |
|Assumptions:|Hidden courses are not visible to Learner/Guest roles.|   |   |

  

### 5.2 View Course Details

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-16. View Course Details|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows users to view specific information about a selected course, including the curriculum description, target band score, total sessions, and tuition fee.|   |   |
|Trigger:|The user wants to view specific information about a course.|   |   |
|Preconditions:|PRE-1: The User is viewing the course list.<br><br>PRE-2: The target Course is selected.|   |   |
|Postconditions:|POST-1: Detailed information about the course is displayed|   |   |
|Normal Flow:|16.0 View Course Details<br><br>1. The User clicks on “View Details” on a specific course card.<br><br>2. The system retrieves and displays the course's detailed curriculum, fees, and sessions.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|16.0.E1 Course unavailable<br><br>1. If the course is disabled, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-01, BR-15|   |   |
|Other Information:|Displays curriculum, target band score, total sessions, and tuition fee.|   |   |
|Assumptions:|The information displayed corresponds exactly to the data in the system.|   |   |

  

### 5.3 Create Course 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-17 Create Course|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to define and publish a new IELTS course program, configuring its standard price, total duration, and description.|   |   |
|Trigger:|Admin wants to define and create a new course.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated.<br><br>PRE-2: The Admin has permission to manage courses.|   |   |
|Postconditions:|POST-1: A new Course is persistently stored in the system.<br><br>POST-2: The Course becomes available for Class creation.|   |   |
|Normal Flow:|17.0 Create Course <br><br>1. The Admin clicks on “Create Course”.<br>    <br>2. The system displays the course creation form.<br>    <br>3. The Admin fills in course details (price, duration, description) and clicks “Save”.<br>    <br>4. The system validates and saves it, then displays MSG-02: “Data has been successfully created.”|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|17.0.E1 Duplicate Code<br><br>1. If the course code exists, the system displays MSG-37 “This code already exists, please choose another one.”.<br><br>2. The Admin edits the code and submits again.<br><br>17.0.E2 Invalid Information<br><br>1. If validation fails, the system displays MSG-16 “Please fill in all required fields.” under the corresponding input.<br><br>17.0.E3 Admin clicks “Cancel”<br><br>1. The system turns off the creation form.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-14, BR-17, BR-39|   |   |
|Other Information:|Course codes must be unique across the system.|   |   |
|Assumptions:|After the Admin saves, the data must be updated into the database and display a success message within a second.|   |   |

  

### 5.4 Update Course Details  

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-18 Update Course Details|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to modify an existing course’s syllabus, adjust the tuition fee, or change the total number of required sessions.|   |   |
|Trigger:|Admin wants to modify an existing course’s syllabus, fee, or sessions.|   |   |
|Preconditions:|PRE-1: Admin has successfully accessed the system. <br><br>PRE-2: The target Course exists in the system.|   |   |
|Postconditions:|POST-1:The target Course attributes are updated in the database.|   |   |
|Normal Flow:|18.0 Update Course Details<br><br>1. The Admin clicks on “Edit” on a specific course.<br>    <br>2. The system displays the course editing form.<br>    <br>3. The Admin edits information and clicks “Save”.<br>    <br>4. The system validates and updates the data, then displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|18.0.E1 Invalid Information<br><br>1. If validation fails, the system displays MSG-16 “Please fill in all required fields.” under the input.<br><br>2. The Admin reinputs valid data.<br><br>18.0.E2  Admin clicks “Cancel”<br><br>1. The system turns off the editing form and redirects to view course details.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-14, BR-17, BR-39|   |   |
|Other Information:|Course codes must be unique across the system.|   |   |
|Assumptions:|After the Admin saves, the data must be updated into the database and display a success message within a second.|   |   |

  

### 5.5  Change Course Visibility  

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-19  Change Course Visibility|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to toggle the display status of a course (Show/Hide) on the public-facing guest portal.|   |   |
|Trigger:|Admin wants to toggle the display status of a course.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to manage courses.<br><br>PRE-2: T The target Course exists.|   |   |
|Postconditions:|POST-1:The Course visibility status is updated in the database.|   |   |
|Normal Flow:|19.0 Change Course Visibility process<br><br>1. The Admin clicks the visibility toggle switch for a course.<br>    <br>2. The system displays a confirmation pop-up.<br>    <br>3. The Admin clicks “Confirm”.<br>    <br>4. The system updates status and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|19.0.E1 Admin clicks “Cancel”<br><br>1. The system turns off the confirmation pop-up and cancels the status change.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-15, BR-39|   |   |
|Other Information:|Used to hide courses that are no longer offered from the public guest portal.|   |   |
|Assumptions:|Hidden courses are not visible to Learners or Guests, but remain visible to Staff/Admin.|   |   |

  

## 6. Facility Management

### 6.1 View Classrooms

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-20. View Classrooms|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to view the list of physical classrooms at the center, including details like room name and maximum student <br><br>capacity.|   |   |
|Trigger:|Admin wants to view the list of physical classrooms.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated and viewing the classroom list.<br><br>PRE-2: Classrooms exist in the system.|   |   |
|Postconditions:|POST-1: The list of classrooms is displayed.|   |   |
|Normal Flow:|20.0 View Classrooms process<br><br>1. The Admin clicks on “Classrooms ” from the menu.<br>    <br>2. The system retrieves and displays the grid/list of classrooms.|   |   |
|Alternative Flows:|20.1.A1 Search by room name<br><br>1. The Admin fills in the room name in the search bar and presses Enter.<br><br>2. The system displays classrooms that match the search.|   |   |
|Exceptions:|20.0.E1 No matching result<br><br>1. The system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Lists room identifier, maximum capacity, and current operational status.|   |   |
|Assumptions:|The system accurately reflects the most recent classroom data.|   |   |

  

### 6.2 Add Classroom

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-21. Add Classroom|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to register a new physical classroom into the system, specifying the room identifier and seating capacity.|   |   |
|Trigger:|Admin wants to register a new physical classroom.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to manage subjects.|   |   |
|Postconditions:|POST-1:A new Classroom is saved in the database.<br><br>POST-2: The Classroom becomes available for scheduling.|   |   |
|Normal Flow:|21.0 Add Classroom process <br><br>1. The Admin clicks on “ Add Classroom”.<br>    <br>2. The system displays the classroom creation form.<br>    <br>3. The Admin fills in the room identifier and capacity, then clicks “Save”.<br>    <br>4. The system validates, saves the data, and displays MSG-02: “Data has been successfully created.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|21.0.E1 Duplicate Room Name<br><br>1. If the room name exists, the system displays MSG-39 “You have already registered for this class.”<br><br>21.0.E2 Invalid Information<br><br>1. If validation fails, the system displays MSG-16 “Please fill in all required fields.”<br><br>21.0.E3 Admin clicks “Cancel”<br><br>    1. The system turns off the creation form.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-39|   |   |
|Other Information:|Room identifiers must be unique within the center|   |   |
|Assumptions:|After the Admin saves, the data must be updated into the database and display a success message within a second.|   |   |

  

### 6.3 Update Classroom Status 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-22. Update Classroom Status|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to edit classroom details or change its operational status (e.g., Available, Under Maintenance).|   |   |
|Trigger:|Admin wants to edit classroom details or change operational status.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to manage classrooms<br><br>PRE-2: The target Classroom exists.|   |   |
|Postconditions:|POST-1: The classroom attributes or status are updated in the database.|   |   |
|Normal Flow:|22.0 Update Classroom Status process<br><br>1. The Admin clicks on “Update Classroom” for a classroom.<br>    <br>2. The system displays the edit form.<br>    <br>3. The Admin modifies capacity or status (e.g., Under Maintenance) and clicks “Save”.<br>    <br>4. The system updates and displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|22.0.E1 Invalid Information<br><br>1. If validation fails, the system displays MSG-16 “Please fill in all required fields.”<br><br>22.0.E2 Admin clicks “Cancel”<br><br>   1. The system turns off the editing form and cancels changes.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-39|   |   |
|Other Information:|Changing status to ‘Under Maintenance’ may affect scheduling for classes currently assigned to this room.|   |   |
|Assumptions:|After saving, the database updates within a second and reflects the new status.|   |   |

  

## 7. Tutor Profile Management 

### 7.1 Update Qualifications

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-23. Update Qualifications|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Tutor|Secondary Actors:|None|
|Description:|Allows a Tutor to upload digital copies of their academic degrees, IELTS certificates, and update their teaching experience for Staff <br><br>verification.|   |   |
|Trigger:|The tutor wants to upload certificates/degrees.|   |   |
|Preconditions:|PRE-1: The Tutor is authenticated and assigned to a curriculum.|   |   |
|Postconditions:|POST-1: The digital files are uploaded and saved.<br><br>POST-2: The qualification verification status is marked as ‘Pending’.|   |   |
|Normal Flow:|23.0 Update Qualifications process<br><br>1. The Tutor clicks on “Update Qualifications” in their profile.<br>    <br>2. The system displays the document upload form.<br>    <br>3. The Tutor uploads files and clicks “Save”.<br>    <br>4. The system saves the files and displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|23.0.E1 Invalid File Format/Size<br><br>1. If the file is too large or wrong type, the system displays MSG-23 “Invalid score. Values must be between 0.0 and 9.0.” under the upload box.<br><br>2. The Tutor selects a valid file.<br><br>23.0.E2 Tutor clicks “Cancel”<br><br>1. The system cancels the upload and returns to the profile screen.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-08|   |   |
|Other Information:|Supported formats: PDF, JPG, PNG.|   |   |
|Assumptions:|Uploaded certificates must be verified by Staff before they are considered officially approved.|   |   |

  
  

### 7.2 View Tutor Certificates

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-24. View Tutor Certificates|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to browse the list of Tutor Certificates and review their current verification status.|   |   |
|Trigger:|Staff wants to review Tutor Certificates.|   |   |
|Preconditions:|PRE-1:The Staff is authenticated with HR permissions.<br><br>PRE-2:Tutors have uploaded certificates.|   |   |
|Postconditions:|POST-1: A list of tutor certificates with their verification statuses is displayed.|   |   |
|Normal Flow:|24.0 View Tutor Certificates process<br><br>1. The Staff clicks on “ View Tutor Certificates” from the menu.<br>    <br>2. The system retrieves and displays the list of certificates.|   |   |
|Alternative Flows:|24.1.A1 Search by Tutor Name<br><br>1. The Staff inputs tutor name in the search bar and presses Enter.<br><br>2. The system displays the matching Certificates.<br><br>24.2.A2 Filter by Status<br><br>1. The Staff filters by ‘Pending’, ‘Approved’, or ‘Rejected’.<br><br>2. The system displays the corresponding results.|   |   |
|Exceptions:|24.0.E1 No matching result<br><br>1. The system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Staff uses this to manage the verification workflow.|   |   |
|Assumptions:|Pending certificates are displayed at the top of the list by default to prioritize review.|   |   |

  

### 7.3 Approve Qualification 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-25. Approve Qualification|   |   |
|Created By:|LinhNTPHE191370|Date Created:|15/06/2025|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to verify the authenticity of a Tutor’s uploaded certificates and officially approve or reject their qualification.|   |   |
|Trigger:|Staff wants to verify and approve or reject a Tutor’s uploaded <br><br>certificates.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to verify certificates.<br><br>PRE-2: The target certificate exists and is ‘Pending’|   |   |
|Postconditions:|POST-1: The certificate’s verification status is updated to ‘Approved’ or ‘Rejected’ in the database.|   |   |
|Normal Flow:|25.0 Approve Qualification process<br><br>1. The Staff clicks “Approve” or “Reject” on a specific certificate.<br>    <br>2. The system displays a confirmation pop-up.<br>    <br>3. The Staff clicks “Confirm”.<br>    <br>4. The system updates the status and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|25.0.E1 Staff clicks “Cancel”<br><br>1. The system turns off the confirmation pop-up and cancels the action.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-08|   |   |
|Other Information:|Only approved qualifications allow the Tutor to be assigned to relevant classes.|   |   |
|Assumptions:|After Staff confirms, the database must be updated and a success message displayed within a second.|   |   |

  
  

## 8. Class Management 

### 8.1 View Classes 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-26. View Classes|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff to view the list of all currently active, upcoming, or completed offline classes for management purposes.|   |   |
|Trigger:|Staff wants to view the list of all currently active, upcoming, or completed offline classes.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to manage classes.<br><br>PRE-2: Classes exist in the system.|   |   |
|Postconditions:|POST-1: The list of classes is displayed.|   |   |
|Normal Flow:|26.0 View Classes process<br><br>1. The Staff clicks on “Classes” from the Menu.<br>    <br>2. The system retrieves and displays the grid/list of classes.|   |   |
|Alternative Flows:|26.1.A1 Search by class code<br><br>1. The Staff inputs the class code in the search bar and presses Enter.<br>    <br>2. The system displays the matching class.<br>    <br><br>26.2.A1 Filter by Status/Tutor/Course<br><br>1. The Staff selects options in the filter dropdowns.<br>    <br>2. The system displays the filtered class list.|   |   |
|Exceptions:|26.0.E1 No matching result<br><br>1. The system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-23|   |   |
|Other Information:|By default, classes are sorted by start date.|   |   |
|Assumptions:|The system fetches the most up-to-date schedule and status for all classes.|   |   |

### 8.2 Create Class 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-27. Create Class|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff to initialize a new offline class linked to a specific course, assigning a physical classroom, a default Tutor, and setting a maximum capacity constraint.|   |   |
|Trigger:|Staff wants to initialize a new offline class.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated with academic scheduling access.<br><br>PRE-2: Valid Courses, Classrooms, and Tutors exist.|   |   |
|Postconditions:|POST-1: The new Class is persistently saved in the database.<br><br>POST-2: The Class becomes available for Learner registration.|   |   |
|Normal Flow:|27.0 Create Class process<br><br>1. The Staff clicks on “Create Class”.<br>    <br>2. The system displays the class creation form.<br>    <br>3. The Staff selects Course, Tutor, Classroom, and sets schedule, then clicks “Save”.<br>    <br>4. The system validates availability, saves the class, and displays MSG-02: “Data has been successfully created.”.|   |   |
|Alternative Flows:|Node|   |   |
|Exceptions:|27.0.E1 Scheduling Conflict<br><br>1. If the selected room or tutor is already booked at that time, the system displays MSG-41: “The tutor already has a class scheduled at this time.” or MSG-42: “The classroom is already booked at this time.”.<br>    <br>2. TheStaff changes the schedule or resources.<br>    <br><br>27.0.E2 Invalid Information<br><br>1. If validation fails, the system displays MSG-16: “Please fill in all required fields.”.<br>    <br><br>27.0.E3 Staff clicks “Cancel”<br><br>1. The system turns off the creation form.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-18, BR-19, BR-20, BR-21, BR-39|   |   |
|Other Information:|Scheduling constraints must be strictly checked before creation.|   |   |
|Assumptions:|After the Staff saves, the data must be updated into the database and display a success message within a second.|   |   |

### 8.3 Update Class Details 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-28. Update Class Details|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff to reassign a different Tutor, change the physical classroom, or modify the status of an existing class.|   |   |
|Trigger:|Staff wants to reassign a different Tutor, change classroom, or modify the status of a class.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to manage class status.<br><br>PRE-2: The target Class exists.|   |   |
|Postconditions:|POST-1: The Class attributes are successfully updated in the database.|   |   |
|Normal Flow:|28.0 Update Class Details process<br><br>1. The Staff clicks on “Edit” for a specific class.<br>    <br>2. The system displays the edit form.<br>    <br>3. The Staff makes changes (e.g., changes Tutor) and clicks “Save”.<br>    <br>4. The system validates room/tutor availability, saves the data, and displays MSG-03: “Information updated successfully.”.|   |   |
|Alternative Flows:|Node|   |   |
|Exceptions:|28.0.E1 Scheduling Conflict<br><br>1. The system displaysMSG-41: “The tutor already has a class scheduled at this time.” or MSG-42: “The classroom is already booked at this time.”.<br>    <br>2. The Staff adjusts the schedule.<br>    <br><br>28.0.E2 Invalid Information<br><br>1. The system displays MSG-16: “Please fill in all required fields.”.<br>    <br><br>28.0.E3 Staff clicks “Cancel”<br><br>1. The system turns off the editing form.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-18, BR-19, BR-20, BR-21, BR-39|   |   |
|Other Information:|Cannot change the Course once a class is created.|   |   |
|Assumptions:|After saving, the database updates within a second and reflects the new class details.|   |   |

### 8.4 View Class Details

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-29. View Class Details|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor, Staff|Secondary Actors:|None|
|Description:|Allows users to view specific offline class information including the Learner roster, assigned physical room, and Tutor details.|   |   |
|Trigger:|User wants to view specific offline class information including roster, room, and tutor.|   |   |
|Preconditions:|PRE-1: The User is authenticated and viewing class details.<br><br>PRE-2: The target Class exists.|   |   |
|Postconditions:|POST-1: The detailed class information is displayed.|   |   |
|Normal Flow:|29.0 View Class Details<br><br>1. The User clicks on “View Details” for a specific class.<br>    <br>2. The system retrieves and displays the class details, tutor, schedule, and learner roster.|   |   |
|Alternative Flows:|Node|   |   |
|Exceptions:|29.0.E1 Class Not Found<br><br>1. If the class doesn’t exist, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-11|   |   |
|Other Information:|Learners only see classes they are enrolled in.|   |   |
|Assumptions:|The displayed roster and schedule match the latest data in the database.|   |   |

### 8.5 View Tutor Availability

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-30. View Tutor Availability|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to check the aggregated availability matrix of all Tutors to assist in scheduling new classes.|   |   |
|Trigger:|Staff wants to check the aggregated availability matrix of Tutors.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to manage schedules.|   |   |
|Postconditions:|POST-1: The availability matrix is displayed.|   |   |
|Normal Flow:|30.0 View Tutor Availability<br><br>1. The Staff clicks on “Tutor availability schedule” from the menu.<br>    <br>2. The system fetches and displays the availability grid for all tutors.|   |   |
|Alternative Flows:|30.1.A1 Filter by date or Tutor<br><br>1. The Staff selects a specific week/month or searches a Tutor’s name.<br>    <br>2. The system displays the filtered availability.|   |   |
|Exceptions:|30.0.E1 No matching result<br><br>1. The system displays MSG-35: “The requested data was not found”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Helps Staff schedule classes effectively without causing conflicts.|   |   |
|Assumptions:|The matrix accurately reflects what the Tutors have registered in their portals.|   |   |

  

## 9. Schedule Management  

### 9.1 Register Available Time Slots

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-31. Register Available Time Slots|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Tutor|Secondary Actors:|None|
|Description:|Allows a Tutor to select and submit their weekly or monthly available time slots to inform the center of their teaching availability.|   |   |
|Trigger:|Tutor wants to submit their weekly/monthly available time slots.|   |   |
|Preconditions:|PRE-1: The Tutor is authenticated to the availability portal.<br><br>PRE-2: The system is currently in the availability registration period.|   |   |
|Postconditions:|POST-1: The Tutor’s registered time slots are saved in the database.|   |   |
|Normal Flow:|31.0 Register Available Time Slots<br><br>1. The Tutor navigates to “Register Availability”.<br>    <br>2. The system displays the calendar interface.<br>    <br>3. The Tutor selects available slots and clicks “Save”.<br>    <br>4. The system validates the submission, saves the data, and displays MSG-02: “Data has been successfully created.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|31.0.E1 Outside Registration Period<br><br>1. The system disables editing and displays MSG-45:”Currently not in the availability registration period.”.<br>    <br><br>31.0.E2 Tutor clicks “Cancel”<br><br>1. The system cancels the registration and reverts the calendar to the previous state.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-22|   |   |
|Other Information:|Tutors must submit their availability before Staff can assign them to upcoming classes.|   |   |
|Assumptions:|After saving, the data is updated in the database within a second and success message is displayed.|   |   |

### 9.2 View Overall Teaching Schedule

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-32. View Overall Teaching Schedule|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to view a master calendar displaying the teaching schedules of all Tutors across all physical classrooms.|   |   |
|Trigger:|Staff wants to view the master calendar of teaching schedules.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to manage academic timetables.|   |   |
|Postconditions:|POST-1: The master teaching schedule calendar is displayed.|   |   |
|Normal Flow:|32.0 View Overall Teaching Schedule<br><br>1. The Staff clicks on “Overall Teaching Schedule” from the menu.<br>    <br>2. The system retrieves and displays the master calendar.|   |   |
|Alternative Flows:|32.1.A1 Filter schedule<br><br>1. The Staff filters by Tutor, Classroom, or Course.<br>    <br>2. The system displays filtered schedule.|   |   |
|Exceptions:|32.0.E1 No Records<br><br>1. The system displays MSG-35: “The requested data was not found”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|None|   |   |
|Other Information:|Helps Staff monitor center-wide operations on any given day.|   |   |
|Assumptions:|The calendar correctly maps tutors and classes to physical rooms.|   |   |

### 9.3 View Personal Teaching Schedule

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-33. View Personal Teaching Schedule|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Tutor|Secondary Actors:|None|
|Description:|Allows a Tutor to view their personalized timetable containing assigned classes, specific dates, times, and designated room numbers.|   |   |
|Trigger:|Tutor wants to view their personalized timetable.|   |   |
|Preconditions:|PRE-1: The Tutor is authenticated and viewing their schedule.|   |   |
|Postconditions:|POST-1: The personal teaching schedule is displayed.|   |   |
|Normal Flow:|33.0 View Personal Teaching Schedule<br><br>1. The Tutor clicks on “My teaching schedule” in their Portal.<br>    <br>2. The system fetches and displays their personalized timetable.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|33.0.E1 No Records<br><br>1. The system displays MSG-35: “The requested data was not found” if the tutor has no assigned classes.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-11|   |   |
|Other Information:|Tutors can see upcoming sessions, times, and room assignments.|   |   |
|Assumptions:|The schedule accurately reflects approved changes and current class assignments.|   |   |

### 9.4 Request Schedule Change

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-34. Request Schedule Change|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Tutor|Secondary Actors:|None|
|Description:|Allows a Tutor to submit a formal request to cancel a specific assigned teaching session or request a substitute teacher due to emergencies.|   |   |
|Trigger:|Tutor wants to submit a formal request to cancel/change schedule.|   |   |
|Preconditions:|PRE-1: The Tutor is authenticated and viewing their assigned Sessions.<br><br>PRE-2: The target session exists and is assigned to the Tutor.|   |   |
|Postconditions:|POST-1: A schedule change request is saved in the database.<br><br>POST-2: Staff can view the pending request.|   |   |
|Normal Flow:|34.0 Request Schedule Change<br><br>1. The Tutor clicks on “Request rescheduled” for a specific session.<br>    <br>2. The system displays the request Form.<br>    <br>3. The Tutor provides a reason and alternative options, then clicks “Submit”.<br>    <br>4. The system validates and saves the request, then displays MSG-12: “Support request sent successfully. We will respond shortly.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|34.0.E1 Validation Error<br><br>1. If required fields are missing, the system displays MSG-16: ”Please fill in all required fields.”.<br>    <br><br>34.0.E2 Tutor clicks “Cancel”<br><br>1. The system turns off the form and cancels the request.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|None|   |   |
|Other Information:|Schedule change requests must be submitted in advance according to center policies.|   |   |
|Assumptions:|The Staff is responsible for finding a substitute or approving the new time.|   |   |

### 9.5 Process Schedule Change Request

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-35. Process Schedule Change Request|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to review, verify classroom availability, and approve or reject Tutor schedule change requests to maintain continuity.|   |   |
|Trigger:|Staff wants to review and approve/reject Tutor’s schedule change request.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to handle schedule requests.<br><br>PRE-2: A pending schedule change request exists.|   |   |
|Postconditions:|POST-1: The request status is updated (Approved/Rejected).<br><br>POST-2: If approved, the class schedule is updated.|   |   |
|Normal Flow:|35.0 Process Schedule Change Request <br><br>1. The Staff clicks on a pending request.<br>    <br>2. The Staff selects “Approve” (with an alternative schedule/substitute) or “Reject”.<br>    <br>3. The system displays a confirmation pop-up.<br>    <br>4. The Staff clicks “Confirm”.<br>    <br>5. The system updates the schedule and request status, displaying MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|35.0.E1 Scheduling Conflict<br><br>1. If approving creates a room/tutor conflict, the system displays MSG-41: “The tutor already has a class scheduled at this time.” or MSG-42: “The classroom is already booked at this time.”.<br>    <br>2. Staff modifies the proposed changes.<br>    <br><br>35.0.E2 Staff clicks “Cancel”<br><br>1. The system cancels the action and closes the pop-up.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Reject should ideally include a reason sent to the Tutor.|   |   |
|Assumptions:|If approved, the system automatically propagates the new schedule to affected Learners.|   |   |

### 9.6 View Personal Class Schedule

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-36. View Personal Class Schedule|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to view their personalized timetable containing their enrolled classes, session dates, times, and assigned physical room numbers.|   |   |
|Trigger:|Learner wants to view their personalized timetable.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated and exploring available courses.|   |   |
|Postconditions:|POST-1: The Learner’s personal schedule is displayed.|   |   |
|Normal Flow:|36.0 View Personal Class Schedule<br><br>1. The Learner clicks “My schedule”.<br>    <br>2. The system retrieves and displays the schedule of all enrolled classes.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|36.0.E1 No Records<br><br>1. The system displays MSG-35: “The requested data was not found” if the tutor has no assigned classes.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-12|   |   |
|Other Information:|Shows date, time, physical classroom, and tutor.|   |   |
|Assumptions:|The schedule immediately reflects any changes made by the Staff.|   |   |

  

## 10. Enrollment Management

### 10.1 Register for Class

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-37. Register for Class|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to select an available offline class that has empty slots and enroll in it, generating a pending tuition invoice.|   |   |
|Trigger:|Learner wants to enroll in an available class.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated to the enrollment portal.<br><br>PRE-2: The target Class is in ‘Open’ status and has available capacity.|   |   |
|Postconditions:|POST-1:A pending tuition invoice is generated.<br><br>POST-2: The Learner is temporarily enrolled pending payment completion.|   |   |
|Normal Flow:|37.0 Register for Class<br><br>1. The Learner clicks “Enrollment” on an open class.<br>    <br>2. The system displays a confirmation prompt.<br>    <br>3. The Learner clicks “Confirm”.<br>    <br>4. The system validates capacity, generates an invoice, and displays MSG-10: “Class registration successful. Please pay within 15 minutes.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|37.0.E1 Capacity Reached<br><br>1. The system displays MSG-38: ”The class has reached its maximum capacity.”.<br>    <br><br>37.0.E2 Schedule Conflict<br><br>1. If it conflicts with another enrolled class, the system displays MSG-43: “This class schedule conflicts with a class you are currently taking. ”.<br>    <br><br>37.0.E3 Already Registered<br><br>1. The system displays MSG-39: “You have already registered for this class.”.<br>    <br><br>37.0.E4 Learner clicks “Cancel”<br><br>1. The system closes the prompt.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-24, BR-25, BR-26|   |   |
|Other Information:|The learner must pay the invoice within a specific timeframe or the enrollment is dropped.|   |   |
|Assumptions:|Registration is first-come, first-served based on capacity.|   |   |

  

### 10.2 View Enrolled Classes

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-38. View Enrolled Classes|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to view a comprehensive list of all their currently active and completed offline classes.|   |   |
|Trigger:|Learner wants to view all their enrolled classes.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated and viewing their dashboard.|   |   |
|Postconditions:|POST-1: The list of enrolled classes is displayed.|   |   |
|Normal Flow:|38.0 View Enrolled Classes<br><br>1. The Learner clicks on “My classes”.<br>    <br>2. The system retrieves and displays the list of their active and completed classes.|   |   |
|Alternative Flows:|38.1.A1 Filter by Status<br><br>1. The Learner selects “Active” or “Completed”.<br>    <br>2. The system displays the filtered list.|   |   |
|Exceptions:|38.0.E1 No Records<br><br>1. The system displays MSG-35: “The requested data was not found” if the tutor has no assigned classes.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-12|   |   |
|Other Information:|Helps learners navigate directly to their class details and materials.|   |   |
|Assumptions:|The system accurately categorizes active vs completed classes based on the schedule.|   |   |

  

## 11. Training Management

### 11.1 Take Class Attendance 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-39: Take Class Attendance|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Tutor|Secondary Actors:|None|
|Description:|Allows a Tutor to mark the attendance status (Present, Absent with permission, Absent without permission) for each enrolled Learner during an offline session.|   |   |
|Trigger:|Tutor wants to mark attendance for a class session.|   |   |
|Preconditions:|PRE-1: The Tutor is authenticated and actively teaching a class.<br><br>PRE-2: The class session is currently taking place or has just finished.|   |   |
|Postconditions:|POST-1: The attendance records for the session are saved in the database.|   |   |
|Normal Flow:|39.0 Take Class Attendance<br><br>1. The Tutor clicks “Attendance” for the current session.<br>    <br>2. The system displays the learner roster.<br>    <br>3. The Tutor selects the attendance status (Present, Absent, etc.) for each learner and clicks “Save”.<br>    <br>4. The system validates the submission, saves the data, and displays MSG-13: “Attendance saved successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|39.0.E1 Validation Error<br><br>1. If fields are missing or invalid, the system displays MSG-16: “Please fill in all required fields.”.<br>    <br><br>39.0.E2 Outside Allowed Time<br><br>1. The system prevents editing if the time window has passed.<br>    <br><br>39.0.E3 Tutor clicks “Cancel”<br><br>1. The system discards changes and closes the form.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-11, BR-27, BR-28|   |   |
|Other Information:|Attending school regularly has an impact on academic performance.|   |   |
|Assumptions:|Tutors take attendance on the same day as the session.|   |   |

  

### 11.2 View Attendance Progress

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-40: View Attendance Progress|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to track personal attendance statistics across all enrolled classes to monitor academic progress.|   |   |
|Trigger:|Learner wants to track their attendance statistics.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated and viewing their enrolled Classes.<br><br>PRE-2: The Learner is enrolled in at least one class.|   |   |
|Postconditions:|POST-1: The attendance statistics (Present/Absent rates) are displayed.|   |   |
|Normal Flow:|40.0 View Attendance Progress<br><br>1. The Learner clicks “Attendance progress”.<br>    <br>2. The system fetches and displays the attendance statistics across enrolled classes.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|40.0.E1 No Records<br><br>1. If no attendance data exists, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-12|   |   |
|Other Information:|Helps learners ensure they meet the minimum attendance requirement.|   |   |
|Assumptions:|The progress accurately reflects the Tutor’s attendance inputs.|   |   |

  

### 11.3 View Attendance Reports

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-41: View Attendance Reports|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to view and monitor attendance records across all classes to track training quality and learner engagement.|   |   |
|Trigger:|Staff wants to monitor attendance records across classes.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated with customer relationship permissions.|   |   |
|Postconditions:|POST-1: Attendance reports and logs are displayed.|   |   |
|Normal Flow:|41.0 View Attendance Reports<br><br>1. The Staff clicks on “Attendance report”.<br>    <br>2. The system fetches and displays attendance logs and aggregated reports.|   |   |
|Alternative Flows:|41.1.A1 Filter Reports<br><br>1. Staff selects filters like Course, Class, Date, or Tutor.<br>    <br>2. System displays the filtered report.|   |   |
|Exceptions:|41.0.E1 No Records<br><br>1. If no data matches the criteria, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|None|   |   |
|Other Information:|Used to ensure tutors are taking attendance properly and to identify learners at risk.|   |   |
|Assumptions:|Data is updated in real-time as tutors submit attendance.|   |   |

### 11.4 Manage Academic Grades

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-42: Manage Academic Grades|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Tutor|Secondary Actors:|None|
|Description:|Allows a Tutor to input, edit, and submit final course grades for each Learner in their assigned offline class.|   |   |
|Trigger:|Tutor wants to input/edit final grades for learners.|   |   |
|Preconditions:|PRE-1: The Tutor is authenticated and authorized to submit grades.<br><br>PRE-2: The class has completed the final assessment.|   |   |
|Postconditions:|POST-1: The learners’ grades are saved and the overall band is calculated.|   |   |
|Normal Flow:|42.0 Manage Academic Grades<br><br>1. The Tutor clicks “Enter Grades” for a specific class.<br>    <br>2. The system displays the grade entry form.<br>    <br>3. The Tutor inputs component grades for each learner and clicks “Save”.<br>    <br>4. The system validates the inputs, calculates the overall band, and saves the data, displaying MSG-14: “Scores updated successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|42.0.E1 Validation Error<br><br>1. If inputs are invalid (e.g., negative scores), the system displays MSG-16: “Please fill in all required fields.”.<br>    <br><br>42.0.E2 Tutor clicks “Cancel”<br><br>1. The system discards changes.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-11, BR-29, BR-30, BR-31|   |   |
|Other Information:|Only the assigned Tutor or an Admin can edit grades.|   |   |
|Assumptions:|The system automatically correctly applies the weighting for different grade components.|   |   |

### 11.5 View Academic Transcript

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-43: View Academic Transcript|   |   |
|Created By:|VyDHHE190507|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to view their academic grades and final performance transcript upon course completion.|   |   |
|Trigger:|Learner wants to view their academic grades.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated to view academic records.<br><br>PRE-2: The target course grades are finalized.|   |   |
|Postconditions:|POST-1: The Learner’s academic transcript is displayed.|   |   |
|Normal Flow:|43.0 View Academic Transcript<br><br>1. The Learner clicks “Grades”.<br>    <br>2. The system retrieves and displays the finalized grades and overall band.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|43.0.E1 No Records<br><br>1. If the grades are not yet published, the system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-12|   |   |
|Other Information:|Transcripts are only available after the tutor has submitted final grades.|   |   |
|Assumptions:|The transcript accurately reflects the latest submitted grades.|   |   |

  

## 12. Customer Relationship Management 

### 12.1 Submit Consultation Request

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-44: Submit Consultation Request|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Guest|Secondary Actors:|None|
|Description:|Allows a guest to fill out an online form with their contact details and specific inquiries to request a callback or course consultation.|   |   |
|Trigger:|The actor initiates the action from the UI.|   |   |
|Preconditions:|PRE-1: The Guest navigates to the public contact/consultation page.|   |   |
|Postconditions:|POST-1:  A new consultation request is saved in the database.POST-2: Staff members can view the new request.|   |   |
|Normal Flow:|44.0 Submit Consultation Request<br><br>1. Request1. The Guest submits a consultation form.<br>    <br>2. The system saves the request and displays MSG-12: “Support request sent successfully. We will respond shortly.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|44.0.E1 Validation Error<br><br>1. The system displays MSG-16: “Please fill in all required fields.” MSG-17: “Invalid email format.”, MSG-18: “The phone number must contain 10 to 11 digits.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|None|   |   |
|Assumptions:|The system is operating normally.|   |   |

  

### 12.2 View Consultation Requests

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-45: View Consultation Requests|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to view the list of submitted consultation forms from potential customers, sorted by submission date and status.|   |   |
|Trigger:|The actor initiates the action from the UI.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated and tracking daily leads..|   |   |
|Postconditions:|POST-1: The list of consultation requests is displayed.|   |   |
|Normal Flow:|45.0 View Consultation Request <br><br>1. The Staff views consultation requests<br>    <br>2. The system displays the list of forms.|   |   |
|Alternative Flows:|45.0.A1 View with filter<br><br>1. The Staff filters requests by Status (Pending/Resolved).<br>    <br>2. The system displays filtered requests.|   |   |
|Exceptions:|45.1.E1 No Records<br><br>1. The system displays MSG-35: “The requested data was not found or the record has been deleted.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|None|   |   |
|Assumptions:|The system is operating normally.|   |   |

  
  

### 12.3 Submit Refund Request 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-46: Update Consultation Status|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to log call notes and change the status of a consultation request (e.g., Pending, Contacted, Converted, Canceled).|   |   |
|Trigger:|The actor initiates the action from the UI.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated and manages consultations.<br><br>PRE-2: The target consultation request is selected.|   |   |
|Postconditions:|POST-1: The consultation request status is updated and call notes are saved.|   |   |
|Normal Flow:|46.0 Update Consultation <br><br>1. The Staff updates consultation status.<br>    <br>2. The system saves changes and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|None|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|None.|   |   |
|Assumptions:|The system is operating normally.|   |   |

  

## 13. Promotion Management

### 13.1 View Discount Codes 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-47: View Discount Codes|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to view the list of all active, expired, or deactivated promotional vouchers and discount codes.|   |   |
|Trigger:|Admin wants to view the list of all promotional vouchers and discount codes.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated and has permission to verify bank transfers.|   |   |
|Postconditions:|POST-1: The list of discount codes is displayed.|   |   |
|Normal Flow:|47.0 View Discount Codes <br><br>1. The Admin clicks “Discount Code”.<br>    <br>2. The system retrieves and displays the list of codes.|   |   |
|Alternative Flows:|47.1.A1 Filter Codes <br><br>1. The Admin filters by Expiry Date or Status (Active, Expired, Deactivated).<br>    <br>2. The system displays filtered codes.|   |   |
|Exceptions:|47.0.E1 No Records<br><br>1. The system displays MSG-35: “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|None|   |   |
|Other Information:|Helps Admin track active promotions and usage.|   |   |
|Assumptions:|Expired codes are automatically marked by the system based on date.|   |   |

  

### 13.2 Create Discount Code

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-48: Create Discount Code|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to generate a new promotional code, setting the discount value (percentage or fixed amount), expiration date, and usage limits.|   |   |
|Trigger:|Admin wants to generate a new promotional code.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to manage promotions.|   |   |
|Postconditions:|POST-1: A new discount code is saved and becomes active.|   |   |
|Normal Flow:|48.0 Create Discount Code <br><br>1. The Admin clicks “Create Discount Code”.<br>    <br>2. The Admin fills in code string, discount value, expiry date, and limits.<br>    <br>3. The Admin clicks “Save”.<br>    <br>4. The system validates and saves the code, displaying MSG-02: “Data has been successfully created.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|48.0.E1 Validation Error<br><br>1. The system displays MSG-16 “Please fill in all required fields.” or MSG 24 “The end date cannot be before the start date.”.<br>    <br><br>48.0.E2 Duplicate Code<br><br>1. The system displays MSG-37 “This code already exists, please choose another one.”.<br>    <br><br>48.0.E3 Admin clicks “Cancel”<br><br>1. The system cancels creation.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-34|   |   |
|Other Information:|Discount can be a percentage or a fixed amount.|   |   |
|Assumptions:|Code strings are case-insensitive when used.|   |   |

  

### 13.3 Deactivate Discount Code

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-49: Deactivate Discount Code|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to manually disable or delete an active discount code before its scheduled expiration date.|   |   |
|Trigger:|Admin wants to manually disable an active discount code.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated with promotion management rights.<br><br>PRE-2: The target discount code exists and is currently active.|   |   |
|Postconditions:|POST-1: The discount code is deactivated and can no longer be used.|   |   |
|Normal Flow:|49.0 Deactivate Discount Code<br><br>1. The Admin clicks “Disable” on an active code.<br>    <br>2. The system displays a confirmation prompt.<br>    <br>3. The Admin confirms.<br>    <br>4. The system updates the status and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|49.0.E1 Admin clicks “Cancel”<br><br>1. The system closes the prompt and cancels the action.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-34|   |   |
|Other Information:|Deactivated codes are not deleted, only disabled for future use.|   |   |
|Assumptions:|Existing invoices that already successfully applied the code are unaffected.|   |   |

  
  

## 14. Financial Management

### 14.1 Pay Tuition

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-50: Pay Tuition|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|Payment Gateway|
|Description:|Allows a Learner to be redirected to an external Payment Gateway to complete their tuition payment. The ICMS automatically updates the invoice status to “Paid” upon successful callback.|   |   |
|Trigger:|Learner wants to complete their tuition payment.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated and viewing their invoices.<br><br>PRE-2: The Learner has a Pending invoice.|   |   |
|Postconditions:|POST-1: The invoice is marked as “Paid”.<br><br>POST-2: The Learner’s class enrollment becomes Active.|   |   |
|Normal Flow:|50.0 Pay Tuition process<br><br>1. The Learner clicks “Pay” on a pending invoice.<br>    <br>2. The system redirects to the VNPAY Payment Gateway.<br>    <br>3. The Learner completes the payment via VNPAY.<br>    <br>4. The system receives the webhook, updates the invoice status, and displays MSG-11: “Payment successful. The invoice has been updated.”.|   |   |
|Alternative Flows:|50.1.A1 Pay via e-Wallet (Momo/ZaloPay)<br><br>1. The Learner selects e-Wallet method.<br>    <br>2. The system displays a QR code.<br>    <br>3. The Learner scans and pays.<br>    <br>4. The system receives callback and updates invoice.|   |   |
|Exceptions:|50.0.E1 Payment Error or Canceled<br><br>1. If payment fails or is aborted, the system displays MSG 48 “Payment transaction was canceled or declined by the bank.” or MSG-57 “Payment service is currently unavailable.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-26, BR-32|   |   |
|Other Information:|Ensures secure handling of financial transactions via 3rd party.|   |   |
|Assumptions:|The payment gateway webhook successfully communicates with the system.|   |   |

  

### 14.2 View Payment History

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-51: View Payment History|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to view a historical log of all their tuition invoices, payment dates, applied discounts, and current payment statuses.|   |   |
|Trigger:|Learner wants to view their tuition invoices and payment history.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated and ready to submit a payment.|   |   |
|Postconditions:|POST-1: The Learner’s historical invoices and payment statuses are displayed.|   |   |
|Normal Flow:|51.0 View Payment History <br><br>1. The Learner clicks “Payment History”.<br>    <br>2. The system fetches and displays all invoices.|   |   |
|Alternative Flows:|51.1.A1 Filter by Status<br><br>1. Learner filters by Paid or Pending.<br>    <br>2. System displays filtered invoices.|   |   |
|Exceptions:|51.0.E1 No Records<br><br>1. The system displays MSG-35 “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|BR-12|   |   |
|Other Information:|Serves as proof of payment for the learner.|   |   |
|Assumptions:|Invoice list correctly handles discounts applied during payment.|   |   |

  

### 14.3 Submit Refund Request

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-52: Submit Refund Request|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to submit a formal request to refund their tuition fee if they haven’t attended classes or if they cancel within 24 hours of successful registration.|   |   |
|Trigger:|Learner wants to request a refund for tuition.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated to the refund portal.<br><br>PRE-2: The Learner has a “Paid” invoice eligible for refund.|   |   |
|Postconditions:|POST-1: A refund request ticket is created and queued for Admin review.|   |   |
|Normal Flow:|52.0 Submit Refund Request process <br><br>1. The Learner clicks “Request Refund” on a paid invoice.<br>    <br>2. The Learner provides a reason and bank details, then clicks “Submit”.<br>    <br>3. The system validates the conditions, saves the request, and displays MSG-12: “Support request sent successfully. We will respond shortly.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|52.0.E1 Validation Error / Ineligible<br><br>1. The system displays MSG-49 “Refund request denied as it has been more than 24 hours since payment.” if the conditions are not met or fields are invalid.<br>    <br><br>52.0.E2 Learner clicks “Cancel”<br><br>1. The system cancels the request.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-33|   |   |
|Other Information:|Refunds strictly follow the 24-hour rule or non-attendance policy.|   |   |
|Assumptions:|Admin must manually verify bank details before issuing actual refund.|   |   |

  

### 14.4 Process Refund Request

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-53: Process Refund Request|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to validate the refund conditions (e.g., checking the 24-hour rule or attendance records), calculate the refundable amount, and approve or reject the request.|   |   |
|Trigger:|Admin wants to validate and process a refund request.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to process refunds.<br><br>PRE-2: A pending refund request ticket is selected.|   |   |
|Postconditions:|POST-1: The refund request status is set to Approved or Rejected.<br><br>POST-2: Learner class enrollment is canceled if the refund is approved.|   |   |
|Normal Flow:|53.0 Process Refund Request process<br><br>1. The Admin clicks “Process” on a refund request.<br>    <br>2. The Admin verifies the conditions and selects “Approved” or “Rejected”.<br>    <br>3. The Admin clicks “Save”.<br>    <br>4. The System updates the status, optionally cancels enrollment, and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|53.0.E1 Admin clicks “Cancel”<br><br>1. The system cancels the update operation.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-33|   |   |
|Other Information:|Bank transfers happen outside the system.|   |   |
|Assumptions:|Admin has the authority to make final decisions on borderline cases.|   |   |

  

### 14.5 View Invoices

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-54: View Invoices|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to track all tuition invoices, monitor revenue pipelines, and send automated payment reminders to Learners.|   |   |
|Trigger:|Staff wants to track all tuition invoices across the system.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to view tuition invoices.|   |   |
|Postconditions:|POST-1: All tuition invoices are displayed.|   |   |
|Normal Flow:|54.0 View Invoices process<br><br>1. The Staff clicks “Invoices”.<br>    <br>2. The system retrieves and displays all invoices.|   |   |
|Alternative Flows:|54.1.A1 Filter Invoices<br><br>1. The Staff searches by Learner Name, Invoice ID, or filters by Status.<br>    <br>2. The system displays matching invoices.|   |   |
|Exceptions:|54.0.E1 No Records<br><br>1. If no data matches, the system displays MSG 35 “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|High|   |   |
|Business Rules:|None|   |   |
|Other Information:|Allows Staff to follow up with pending payments.|   |   |
|Assumptions:|Statuses are automatically updated by the payment gateway callback.|   |   |

  
  

## 15. Payroll Management

### 15.1 Calculate Payroll

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-55: Calculate Payroll|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to trigger the monthly payroll calculation, which aggregates validated attendance records and applies predefined hourly rates to compute salary for all Tutors and Staff.|   |   |
|Trigger:|Admin wants to compute monthly salary for Tutors and Staff.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated and authorized to calculate payroll.<br><br>PRE-2: The targeted payroll cycle (month) has ended.|   |   |
|Postconditions:|POST-1: Payroll records are calculated and saved for all active Staff and Tutors.|   |   |
|Normal Flow:|55.0 Calculate Payroll process<br><br>1. The Admin clicks “Calculate payroll”.<br>    <br>2. The Admin selects the target month and clicks “Start”.<br>    <br>3. The system aggregates validated attendance and applies hourly rates.<br>    <br>4. The system saves the payroll records and displays MSG-02 “Data has been successfully created.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|55.0.E1 Admin clicks “Cancel”<br><br>1. The system cancels the process.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-35, BR-39|   |   |
|Other Information:|Payroll can only be run once per month.|   |   |
|Assumptions:|All attendance records for the month are already submitted and finalized by tutors.|   |   |

  

### 15.2 View Overall Payroll

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-56: View Overall Payroll|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to view the aggregated monthly payroll report detailing total salary expenses for all Staff and Tutors.|   |   |
|Trigger:|Admin wants to view aggregated monthly payroll reports.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated and viewing the payroll section.|   |   |
|Postconditions:|POST-1: Aggregated monthly payroll reports are displayed.|   |   |
|Normal Flow:|56.0 View Overall Payroll process<br><br>1. The Admin clicks “Overall Payroll”.<br>    <br>2. The system fetches and displays the payroll reports.|   |   |
|Alternative Flows:|56.1.A1 Filter Payroll<br><br>1. Admin filters by Month, Year, or Role (Staff/Tutor).<br>    <br>2. System displays the filtered report.|   |   |
|Exceptions:|56.0.E1 No Records<br><br>2. If no data exists, the system displays MSG-35 “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Helps track overall HR expenses.|   |   |
|Assumptions:|Information accurately reflects the latest calculation runs.|   |   |

  

### 15.3 Confirm Salary Payment

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-57: Confirm Salary Payment|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to update the status of individual or bulk payroll records to “Paid” after executing actual bank transfers to employees.|   |   |
|Trigger:|Admin wants to update the status of payroll records to “Paid”.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to confirm salary payments.<br><br>PRE-2: A pending calculated payroll record is selected.|   |   |
|Postconditions:|POST-1: The payroll record status is updated to “Paid”.|   |   |
|Normal Flow:|57.0 Confirm Salary Payment process<br><br>1. The Admin clicks “Confirm Payment” on a payroll record.<br>    <br>2. The system displays a confirmation prompt.<br>    <br>3. The Admin confirms.<br>    <br>4. The system updates the status to “Paid” and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|57.1.A1 Bulk Confirm<br><br>1. Admin selects multiple records and clicks “Bulk Confirm”.<br>    <br>2. System updates all selected to Paid.|   |   |
|Exceptions:|57.0.E1 Validation Error<br><br>1. If data is incomplete, the system displays MSG-55 “Payroll can only be disbursed after Admin approval.”.<br>    <br><br>  <br><br>57.0.E2 Admin clicks “Cancel”<br><br>1. The system cancels the update.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-36, BR-39|   |   |
|Other Information:|Done after the actual bank transfers are executed.|   |   |
|Assumptions:|Admin acts truthfully when marking records as paid.|   |   |

  

### 15.4 View Salary History

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-58: View Salary History|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Tutor, Staff|Secondary Actors:|None|
|Description:|Allows Tutors to view their detailed monthly income statements, and Staff to view these records for operational support and verification.|   |   |
|Trigger:|Tutor or Staff wants to view their detailed monthly income statements.|   |   |
|Preconditions:|PRE-1: The Tutor or Staff is authenticated to view salary history.|   |   |
|Postconditions:|POST-1: The user’s personal income statements and salary history are displayed.|   |   |
|Normal Flow:|58.0 View Salary History process<br><br>1. The user clicks “Salary History”.<br>    <br>2. The system retrieves and displays the personal salary history.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|58.0.E1 No Records<br><br>1. The system displays MSG-35 “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|Ensures transparency in payments.|   |   |
|Assumptions:|Only calculated and finalized records are shown.|   |   |

  
  

## 16. Feedback Management

### 16.1 Submit Tutor Review 

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-59: Submit Tutor Review|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Learner|Secondary Actors:|None|
|Description:|Allows a Learner to submit a star rating and written feedback<br><br>evaluating the teaching quality of a Tutor upon completing a course.|   |   |
|Trigger:|Admin navigates to the "System Analytics" portal.|   |   |
|Preconditions:|PRE-1: The Learner is authenticated and eligible to review the Tutor.<br><br>PRE 2: The Learner has completed the course with the target Tutor.|   |   |
|Postconditions:|POST-1: The feedback rating and comments are saved in the system.|   |   |
|Normal Flow:|59.0 Submit Tutor Review<br><br>1. The Learner submits a review.<br>    <br>2. The system saves it and displays MSG-02: “Data has been successfully created.”|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|59.0.E1 Validation Error<br><br>The system displays MSG-16: “Please fill in all required fields.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|None|   |   |
|Assumptions:|The system is operating normally.|   |   |

  

### 16.2 View Tutor Reviews

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-60: View Tutor Reviews|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to aggregate and view all feedback submitted by Learners to monitor and evaluate the overall performance of Tutors.|   |   |
|Trigger:|The actor initiates the action from the UI.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to evaluate Tutors.|   |   |
|Postconditions:|POST-1: Aggregated Tutor reviews and feedback logs are displayed.|   |   |
|Normal Flow:|60.0 View Tutor Reviews<br><br>1. The Admin views tutor reviews.<br>    <br>2. The system fetches feedback logs.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|60.0.E1 No Records<br><br>The system displays MSG-35: “The requested data was not found or the record has been deleted.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|None|   |   |
|Assumptions:|The system is operating normally.|   |   |

  

## 17. Customer Support

### 17.1  Submit Support Ticket

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-61: Submit Support Ticket|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Learner, Tutor|Secondary Actors:|None|
|Description:|Allows Learners and Tutors to create and submit a support ticket to report facility issues, technical bugs, or file a complaint.|   |   |
|Trigger:|The actor initiates the action from the UI.|   |   |
|Preconditions:|PRE-1: The User is authenticated and possesses an active status.s.|   |   |
|Postconditions:|POST-1: A support ticket is logged in the system.POST-2: Associated Staff are notified of the new ticket|   |   |
|Normal Flow:|61.0 Submit Support Ticket<br><br>1. The User submits a support ticket.<br>    <br>2. The system saves it and displays MSG-12: “Support request sent successfully. We will respond shortly.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|61.0.E1 Validation Error<br><br>The system displays MSG-16: “Please fill in all required fields.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|None|   |   |
|Other Information:|None|   |   |
|Assumptions:|The system is operating normally.|   |   |

  

### 17.2 Resolve Support Ticket

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-62: Resolve Support Ticket|   |   |
|Created By:|HieuTMHE204050|Date Created:|23/05/2026|
|Primary Actor:|Staff|Secondary Actors:|None|
|Description:|Allows Staff members to read incoming support tickets, log communication or actions taken, and mark the issue as resolved or closed.|   |   |
|Trigger:|The actor initiates the action from the UI.|   |   |
|Preconditions:|PRE-1: The Staff is authenticated to resolve support tickets.<br><br>PRE-2: A pending support ticket is selected.|   |   |
|Postconditions:|POST-1: The support ticket status is updated to resolved/closed.|   |   |
|Normal Flow:|62.0 Resolve Support Ticket<br><br>1. The Staff resolves the ticket.<br>    <br>2. The system updates status and displays MSG-15: “Status changed successfully.”.|   |   |
|Alternative Flows:|None|   |   |
|Exceptions:|None|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-37|   |   |
|Other Information:|None|   |   |
|Assumptions:|The system is operating normally.|   |   |

  

## 18. Reporting & Analytics

### 18.1 View Revenue Statistics

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-63: View Revenue Statistics|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to view raphical dashboards and detailed eports summarizing incoming tuition revenue and financial growth trends.|   |   |
|Trigger:|Admin wants to view tuition revenue trends.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to view financial dashboards.|   |   |
|Postconditions:|POST-1: Revenue dashboards and financial growth charts are displayed.|   |   |
|Normal Flow:|63.0 View Revenue Statistics process<br><br>1. The Admin clicks “Revenue Statistics”.<br>    <br>2. The system fetches the latest financial data and renders the charts.|   |   |
|Alternative Flows:|63.1.A1 Filter Data<br><br>1. Admin filters by Time Period (e.g., Month, Year).<br>    <br>2. System updates the charts accordingly.|   |   |
|Exceptions:|63.0.E1 No Records<br><br>1. If no revenue data exists, the system displays MSG-35 “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-38|   |   |
|Other Information:|Crucial for upper management decision-making.|   |   |
|Assumptions:|Financial transactions are correctly categorized in the database.|   |   |

  

### 18.3 View Enrollment Statistics

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-64: View Enrollment Statistics|   |   |
|Created By:|HoangPMHE204068|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to view graphical dashboards tracking new Learner registrations, class fill rates, and overall student retention.|   |   |
|Trigger:|Admin wants to view Learner registrations and class fill rates.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated to view registration analytics.|   |   |
|Postconditions:|POST-1: Enrollment statistics, class fill rates, and student retention charts are displayed.|   |   |
|Normal Flow:|64.0 View Enrollment Statistics process<br><br>1. The Admin clicks “Enrollment Statistics”.<br>    <br>2. The system fetches academic data and renders the charts.|   |   |
|Alternative Flows:|64.1.A1 Filter Data<br><br>1. Admin filters by Course or Time Period.<br>    <br>2. System updates the charts accordingly.|   |   |
|Exceptions:|64.0.E1 No Records<br><br>1. If no enrollment data exists, the system displays MSG-35 “The requested data was not found or the record has been deleted.”.|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Medium|   |   |
|Business Rules:|BR-38|   |   |
|Other Information:|Helps optimize course offerings and marketing strategies|   |   |
|Assumptions:|The statistics refresh in near real-time.|   |   |

  

## 19. System Administration

### 19.1 View System Audit Logs

|   |   |   |   |
|---|---|---|---|
|ID and Name:|UC-65_ View System Audit Logs|   |   |
|Created By:|KhanhLQHE204102|Date Created:|23/05/2026|
|Primary Actor:|Admin|Secondary Actors:|None|
|Description:|Allows the Administrator to monitor a secure log of critical data manipulations (e.g., changes to financial records, grade edits) to ensure system integrity.|   |   |
|Trigger:|Admin wants to monitor secure logs of critical data manipulations.|   |   |
|Preconditions:|PRE-1: The Admin is authenticated with required audit permissions.|   |   |
|Postconditions:|POST-1: System audit logs are displayed securely.|   |   |
|Normal Flow:|65.0 View System Audit Logs<br><br>1. The Admin clicks “System Logs”.<br>    <br>2. The system fetches and displays the secure audit logs.|   |   |
|Alternative Flows:|65.1.A1 Filter Logs<br><br>1. Admin filters by User, Module, or Action Type.<br>    <br>2. The system displays matching logs.|   |   |
|Exceptions:|65.0.E1 No Records<br><br>1. If no logs match the criteria, the system displays MSG-35: “The requested data was not found or the record has been deleted.”|   |   |
|Priority:|High|   |   |
|Frequency of Use:|Low|   |   |
|Business Rules:|BR-39|   |   |
|Other Information:|Ensures traceability and security compliance.|   |   |
|Assumptions:|Logs are immutable and retained according to policy.|   |   |
