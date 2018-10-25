# import autocomplete
from wordPredictor.word_predictor.word_predictor import WordPredictor
import nltk

# autocomplete.load()
# results = autocomplete.predict('what', 't')
# suggestedWords = []
# for word in results:
#     suggestedWords.append(word[0])
# print(suggestedWords)
# print(results)

wp = WordPredictor()
for corpus in nltk.corpus.gutenburg.fields():
    wp.learn_from_text(nltk.corpus.gurenburg.raw(corpus))

print("Ready")
# while True:
phrase = input("Enter Text: ")
print (wp.predict(phrase).terms()[0:3])

