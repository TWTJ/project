$(document).ready(function () {

    $("#signup").click(function () {
      location.href = "/signup";
    })
    $("#signin").click(function () {
      location.href = "/signin";
    })
  
  
  // // submit 처리
  //   $(document).ready(function() {
  //     $("/signin/form").submit(function(event) {
  //     const email = $('#user_email').val();
  //     const pw = $('#user_pw').val();
       
  //     if (email !="" && pw !="") {
  //         alert("user_email :: " + email +", user_pw :: " + pw);
  //     }
       
  //     if (email =="") {
  //         alert("E-mail를 입력해주세요.");
  //         event.preventDefault();
  //       return;
  //     }
       
  //     if (pw =="") {
  //         alert("password 를 입력해주세요.");
  //         event.preventDefault();
  //       return;
  //     }  
  //   });
     
  //   $('#btn').click(function () {
  //     $("/signin/form").submit();
  //   });
  
  
  
  
  
  
  
  
  
  
  
  
  
    /*
    $('.form-signin button').click(function(){
      
      event.preventDefault();
      if($('#inputPassword').val()=="" || $('#inputId').val()==""){
        alert("빈 칸을 채워주세요");
        return;
      }
      $.ajax('/sign_in', {
        'method': 'POST',
        'data': {
          'id': $('#inputId').val(),
          'password': $('#inputPassword').val()
         },
         'success' : function(data){
           if(!data.check){
             alert('id 혹은 비밀번호가 맞지 않습니다');
           }
           else{
             alert('로그인 성공')
             location.href="/dapp";
           }
         },
         'error': function(err){
           console.log(err);
         }
  
       })
    })
  
  
   $('.form-signup button').click(function () {
      if ($('#inputPassword').val()!=$('#confirm_Password').val()) {
        window.alert("passwords are not matching!!!!!!!")
        return;
      }
      else if($('#inputPassword').val()=="" || $('#inputId').val()=="" || $('#inputEthAddress').val()==""){
        window.alert("You still have empty space.")
        return;
      }
  
  
  
      event.preventDefault();
      $.ajax('/create', {
        'method': 'POST',
        'data': {
          'Eth_Address': $('#inputEthAddress').val(),
          'id': $('#inputId').val(),
          'password': $('#inputPassword').val()
         },
        'error': function(err){
          console.log(err);
        },
        'success' : function (data) {
          console.log(data);
           if (!data.check)
            alert("We alreay have this ID. Please try the other one.")
           else{
            console.log("성공");
            alert("가입 성공");
            location.href="/login";
          }
        },
  
      })
  
      // var Eth_Address = $('#inputEthAddress').val()
      // var id = $('#inputEthAddress').val()
      // var password = $('#inputEthAddress').val()
  
    })
  */
})
  
  
  
  
  