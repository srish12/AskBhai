var _gaq = [];

var has_answered = [
  'hrm, I am unable to establish a spiritual uplink.',
  'That is an interesting question. I am choosing not to answer.',
  'I like it better when your friend asks the questions.',
  'I do not like you, and will not answer.',
  'I am bhai, and I do not answer to you.'
];

var no_answer = [
  'Unable to extablish spiritual uplink.',
  'The connection to Ask-me has failed, try again.',
  'Maybe you could ask me tomorrow?',
  'Eh, I\'ve decided not to answer.',
  'Wouldn\'t you like to know.',
]


var answerStatus = false,
    falseNext = false,
    startAnswer = endAnswer = false,
    answer = '',
    petitionFormat = 'bhai, please answer the following question';

var resetVariables = function(){
  answerStatus = false;
  falseNext = false;
  startAnswer = endAnswer = false;
  answer = '';
};

var bhaiAnswers = function(answer, question){
  var tmpAnswer = '';
  if(answer.length){
    tmpAnswer = answer.split('.')[1];
    $.cookie('has_answered', 'yes');
    _gaq.push(['_trackEvent', 'Answers', 'Answered', question +'|'+tmpAnswer]);
  } else {
    tmpAnswer = intelliAnswer();
  }
  return tmpAnswer;
};

var intelliAnswer = function(){
  var text;
  if($.cookie('has_answered') == 'yes'){
    _gaq.push(['_trackEvent', 'Answers', 'Answered Before']);
    text = has_answered[Math.floor(Math.random()*has_answered.length)];
  } else {
    _gaq.push(['_trackEvent', 'Answers', 'Not Answered Before']);
    text = no_answer[Math.floor(Math.random()*no_answer.length)];
  }
  return text;
}

$(function(){

  var $questionInput = $('#question'),
      $petitionInput = $('#petition');

  $petitionInput.keydown(function(e){
    // CMD + Del
    if(e.which == 8 && e.metaKey == true){
      resetVariables();
    }

    // Semicolon
    if(e.shiftKey && e.which == 186){
      if(answerStatus) endAnswer = $petitionInput.val().length+1;
      answerStatus = false;
    }

    // Period
    if(e.which == 190 || falseNext){
      if(answerStatus && !falseNext){
        falseNext = true;
      } else {
        if(!answerStatus){
          startAnswer = $petitionInput.val().length+1;
        } else {
          endAnswer = $petitionInput.val().length+1;
        }
        answerStatus = !answerStatus;
        falseNext = false;
      }
    }
  }).keyup(function(e){
    if(e.which == 8){
      var $length = $petitionInput.val().length;
      if(startAnswer && endAnswer && $length >= startAnswer && $length < endAnswer){
        answerStatus = true;
        endAnswer = false;
        answer = answer.substr(0, answer.length-1);
      } else if(startAnswer && !endAnswer && $length < startAnswer){
        answerStatus = false;
        startAnswer = false;
        answer = '';
      } else {
        answer = answer.substr(0, answer.length-1);
      }
    }
  }).keypress(function(e){
    if(answerStatus){
      e.preventDefault();
      $petitionInput.val($petitionInput.val()+petitionFormat.substr($petitionInput.val().length, 1));
      answer += String.fromCharCode(e.which);
    }

    if(e.which == 58){
      e.preventDefault();
      $petitionInput.val($petitionInput.val()+':').attr('disabled', true);
      $questionInput.focus();
    }
  });
  $questionInput.keypress(function(e){
    if(e.which == 63){
      var $answer = $('#answer').clone().addClass('clone').appendTo($('.container'));
      var question = $('#question').val();
      $answer.fadeIn(function(){
          $('#loading', $answer).fadeOut();
          $answer.animate({
            top: 100,
            margin: '0 0 0 -300px',
            width: 480,
          }, 1000).queue(function(){
            $('#text', $answer)
              .css('display', 'none')
              .html('<span>bhai bole, </span>"'+bhaiAnswers(answer, question)+'"')
              .fadeIn();

            $('#text', $answer).css('width', '300');
            $('#new', $answer).fadeIn();
          });
        });
    }
  });
  $(document).on('click', ".clone #new", function(){
    resetVariables();
    $('.clone').remove();
    $('input').val('').prop('disabled', false);
    $('questiontext input').focus();
  });
});