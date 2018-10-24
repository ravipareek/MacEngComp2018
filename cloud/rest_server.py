from flask import Flask, request
from flask_restful import Api,Resource
# from wordPredictor.word_predictor.word_predictor import WordPredictor
# import nltk
import autocomplete
autocomplete.load()

# wp = WordPredictor()
# for corpus in nltk.corpus.gutenburg.fields():
#     wp.learn_from_text(nltk.corpus.gurenburg.raw(corpus))

app = Flask("My Rest Server")
api = Api(app)

@app.route('/')
def hello_world():
    return "Hello World"

class CompleteWord(Resource):
    import autocomplete
    autocomplete.load()

    def get(self):
        import autocomplete
        autocomplete.load()

        previousWord = request.args.get('previousWord')
        currentText = request.args.get('currentText')
        suggestionCount = request.args.get('suggestedCount')
        if (suggestionCount == None):
            suggestionCount = 4

        suggestionCount = int(suggestionCount);

        results = autocomplete.predict(previousWord, currentText, suggestionCount)
        suggestedWords = []
        for word in results:
            suggestedWords.append(word[0])
        print (suggestedWords)
        return suggestedWords,200



api.add_resource(CompleteWord, "/")

app.run(debug=True)