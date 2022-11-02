<template>
  <div class="page-container">
    <v-app-bar color="deep-purple" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list dense>
        <v-list-item two-line>
          <v-list-item-avatar>
            <img
              src="https://forumakademickie.pl/wp-content/uploads/2021/09/PWr2.jpeg"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Zrozpaczony student</v-list-item-title>
            <v-list-item-subtitle>aktywny</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon @click="handleClick(item)">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              style="cursor: pointer"
              @click="handleClick(item)"
              >{{ item.title }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list-item>Kategorie</v-list-item>
      <v-list dense>
        <v-list-item v-for="item in allTopics" :key="item">
          <v-list-item-icon>
            <v-icon @click="randomQuestion(item)">mdi-book</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              style="cursor: pointer"
              @click="randomQuestion(item)"
              >{{ item }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
    </v-navigation-drawer>

    <!-- DIALAG ADD QUESTION -->
    <!------------------------------------------------------------->

    <v-dialog v-model="showAddPanel" width="90%">
      <v-card>
        <v-card-title class="text-h5">
          <span
            style="font-weight: 700; margin-right: 20px"
            v-if="mode == 'add'"
            >Dodaj pytanie</span
          >
          <span
            style="font-weight: 700; margin-right: 20px"
            v-if="mode == 'edit'"
            >Edytuj pytanie</span
          >
        </v-card-title>

        <!-- FORM -->
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form @submit.prevent="submit" v-model="addFormModel">
            <validation-provider
              v-slot="{ errors }"
              name="Pytanie"
              rules="required|max:256"
            >
              <v-text-field
                v-model="addQuestion"
                :counter="256"
                :error-messages="errors"
                label="Pytanie"
                required
              ></v-text-field>
            </validation-provider>
            <validation-provider
              v-slot="{ errors }"
              name="Temat"
              rules="required|max:256"
            >
              <v-text-field
                v-model="addTopic"
                :counter="256"
                :error-messages="errors"
                label="Temat"
                required
              ></v-text-field>
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="Autor pytania/Prowadzący"
              rules="required|max:256"
            >
              <v-text-field
                v-model="addSender"
                :counter="256"
                :error-messages="errors"
                label="Autor pytania/Prowadzący"
                required
              ></v-text-field>
            </validation-provider>
            <!--- answer creator -->
            <!--- answer creator -->
            <!--- answer creator -->
            <!--- answer creator -->
            <!--- answer creator -->
            <v-card class="my-3">
              <v-icon
                class="my-3"
                style="cursor: pointer"
                @click="showAnswerAlert = !showAnswerAlert"
                >mdi-alert-octagram</v-icon
              >
              <validation-provider
                v-slot="{ errors }"
                name="Odpowiedź"
                rules="required|max:9999"
              >
  


                      <v-textarea
                       v-model="addAnswer"
                  :counter="9999"
                  :error-messages="errors"
                  label="Odpowiedź"
                  required
                      ></v-textarea>
              </validation-provider>
            </v-card>
            <!--- answer creator end-->
            <!--- answer creator end-->
            <!--- answer creator end-->
            <!--- answer creator end-->

            <validation-provider
              v-slot="{ errors }"
              name="Keywords"
              rules="required|max:1024"
            >
              <v-text-field
                v-model="addKeywords"
                :counter="1024"
                :error-messages="errors"
                label="Keywords"
                required
              ></v-text-field>
            </validation-provider>

            <v-btn
              class="mr-4"
              type="submit"
              :disabled="invalid"
              @click="sendForm"
            >
              submit
            </v-btn>
            <v-btn @click="clear"> clear </v-btn>
          </v-form>
        </validation-observer>
        <!-- end FORM -->

           <v-text-field
                  v-model="accessToken"
                  :counter="1024"
                  :error-messages="errors"
                  label="Token dostępu"
                  required
                ></v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="showAddPanel = false">
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteConfirm" persistent width="80%">
      <v-card>
        <!--question-->
        <v-card-title> Czy na pewno chcesz usunąć pytanie ? </v-card-title>

        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="deleteConfirm = false">
            Zamknij
          </v-btn>
          <v-btn color="green darken-1" text @click="confirmedRemove()">
            Usuń
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--- showAnswerAlert DIALOG ALERT -->

    <v-dialog v-model="showAnswerAlert" persistent width="80%">
      <v-card>
        <!--question-->
        <v-card-title> Dodawanie odpowiedzi </v-card-title>
        <v-spacer></v-spacer>
        <v-col>
          <span style="margin-bottom: 15px">
            Odpowiedź do pytania może składać się z kilku sekcji wyświetlanych
            później jedna pod drugą. Sekcje należy oddzielić wyrażeniem ^^^.
            Wyświetlanie obsługuje wpisywanie wyrażeń napisanych w TEX
          </span>

          <v-spacer></v-spacer
          ><span
            style="margin-top: 15px; margin-bottom: 15px; font-weight: 600"
          >
            Przykład</span
          >
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>
          <span style="margin-top: 15px; margin-bottom: 15px"
            >Jeżeli chcemy użyskać efekt poniżej</span
          >
          <v-spacer></v-spacer> <v-spacer></v-spacer>
          <span style="margin-top: 10px; margin-bottom: 10px; font-weight: 600"
            >Sekcja 1
          </span>
          <v-spacer></v-spacer> <v-spacer></v-spacer>
          <span style="margin-top: 10px; margin-bottom: 10px; font-weight: 600"
            >Sekcja 2</span
          >
          <v-spacer></v-spacer> <v-spacer></v-spacer>
          <span style="margin-top: 10px; margin-bottom: 10px; font-weight: 600"
            >Sekcja 3</span
          >
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>
          <span style="margin-top: 15px; margin-bottom: 15px">
            Należy w odpowiedzi wpisać Sekcja 1 ^^^ Sekcja 2 ^^^ Sekcja 3
            ^^^</span
          >
          <v-spacer></v-spacer>

          <v-spacer></v-spacer
          ><span
            style="margin-top: 15px; margin-bottom: 15px; font-weight: 600"
          >
            Przykład latex</span
          >
          <v-spacer></v-spacer> <v-spacer></v-spacer>
          <span style="margin-top: 15px; margin-bottom: 15px"
            >Jeżeli chcemy użyskać efekt poniżej</span
          >
          <v-spacer></v-spacer> <v-spacer></v-spacer>
          <vue-mathjax
            formula=" $$p(x) = 3x^6 + 14x^5y + 590x^4y^2 + 19x^3y^3\\  - 12x^2y^4 - 12xy^5 + 2y^6 - a^3b^3 $$"
          ></vue-mathjax>
          <v-spacer></v-spacer> <v-spacer></v-spacer> <v-spacer></v-spacer>
          <span style="margin-top: 15px; margin-bottom: 15px">
            Należy w odpowiedzi wpisać $$p(x) = 3x^6 + 14x^5y + 590x^4y^2 +
            19x^3y^3\\ - 12x^2y^4 - 12xy^5 + 2y^6 - a^3b^3 $$</span
          >
          <v-spacer></v-spacer>
        </v-col>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showAnswerAlert = false">
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALAG CATEGORY QUESTION -->
    <!------------------------------------------------------------->

    <v-dialog v-model="showCategoryQuestion" width="800px" max-width="100%">
      <v-card>
        <v-card-title class="text-h5">
          <span style="font-weight: 700; margin-right: 20px; font-size: 1rem"
            >{{ question.topic }}.</span
          >
          <span style="font-size: 1rem">
            {{ question.question }}
          </span>
        </v-card-title>

        <v-card-text style="margin-top: 1rem; overflow-wrap: break-word">
          <v-btn @click="searchAnswer(question)">Poszukaj odpowiedzi</v-btn>
          <v-expansion-panels>
            <v-expansion-panel class="mt-4">
              <v-expansion-panel-header style="font-size: 1rem">
                Pokaż odpowiedź
              </v-expansion-panel-header>
              <v-expansion-panel-content style="font-size: 0.8rem">
                <v-card-text
                  v-for="(item, i) in parseQuestionJson"
                  :key="i"
                  style="font-size: 0.8rem; overflow-wrap: break-word"
                >
                  <vue-mathjax :formula="item"></vue-mathjax><br />
                </v-card-text>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel class="mt-5">
              <v-expansion-panel-header style="font-size: 1rem">
                Pokaż słowa kluczowe
              </v-expansion-panel-header>
              <v-expansion-panel-content style="font-size: 1rem">
                <v-row>
                  <v-card-text>
                    <span
                      style="font-size: 0.8rem"
                      v-for="el in question.keywords"
                      :key="el"
                      >{{ el }},
                      <div style="width: 10px"></div
                    ></span>
                  </v-card-text>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-card-actions>
          <v-col style="font-size: 0.9rem">
            <v-btn
              color="green darken-1"
              style="font-size: 0.9rem"
              text
              @click="renderNextCategoryQuestion"
            >
              Następne pytanie
            </v-btn>
            <v-btn
              color="green darken-1"
              style="font-size: 0.9rem"
              text
              @click="renderRandomCategoryQuestion"
            >
              Losowe pytanie
            </v-btn>

            <v-btn
              color="green darken-1"
              style="font-size: 0.9rem"
              text
              @click="showCategoryQuestion = false"
            >
              Zamknij
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!---------------------------------------------------------------->

    <!-- DIALAG PREVIEW -->
    <!------------------------------------------------------------->
    <v-dialog v-model="dialog" persistent width="80%">
      <v-card>
        <!--question-->
        <v-card-title
          style="
            margin-top: 1rem;
            overflow-wrap: break-word;
            margin: 1rem 0;
            padding: 0 0 0 0;
            font-size: 0.9rem;
          "
        >
          {{ currentTask.question }}
        </v-card-title>
        <v-spacer></v-spacer>
        <v-card-text
          v-for="(item, i) in parseAnswerJson"
          :key="i"
          style="
            font-size: 0.9rem;
            overflow-wrap: break-word;
            margin: 0.5rem 0;
            padding: 0 0 0 0;
          "
        >
          <vue-mathjax :formula="item"></vue-mathjax><br />
        </v-card-text>
        <v-spacer></v-spacer><br />
        <v-row>
          <v-card-text style="font-size: 1.2rem">
            <span style="font-size: 1rem; font-weight: 700"
              >Słowa kluczowe :</span
            >
            <br /><br />
            <span
              v-for="el in currentTask.keywords"
              :key="el"
              style="font-size: 0.8rem"
              >{{ el }},
              <div style="width: 10px"></div
            ></span>
          </v-card-text>
        </v-row>
        <v-spacer></v-spacer>
        <p style="font-size: 0.9rem"><br />Autor: {{ currentTask.sender }}</p>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">
            Zamknij
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!------------------------------------------------------------->

    <!-- entry point drawer -->
    <v-card height="100%">
      <v-card width="calc(100% )">
        <v-card-title>
          Pytania do obrony
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="allQuestions" :search="search">
          <template v-slot:[`item.chooseTask`]="{ item }">
            <!-- edycja -->
            <v-icon class="mr-2 mt-1 mb-1" medium @click="chooseItem(item)">
              mdi-android-messages
            </v-icon>
            <v-icon class="mr-2 mt-1 mb-1" medium @click="removeItem(item)">
              mdi-delete
            </v-icon>
            <v-icon class="mr-2 mt-1 mb-1" medium @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
    <!-- end of drawer -->
  </div>
</template>

<script>
import { getCities, add, remove, edit } from "../firebaseDatabase";
import { required, digits, email, max, regex } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";
import { VueMathjax } from "vue-mathjax";
// import axios from 'axios';

setInteractionMode("eager");

extend("digits", {
  ...digits,
  message: "{_field_} needs to be {length} digits. ({_value_})",
});

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("max", {
  ...max,
  message: "{_field_} may not be greater than {length} characters",
});

extend("regex", {
  ...regex,
  message: "{_field_} {_value_} does not match {regex}",
});

extend("email", {
  ...email,
  message: "Email must be valid",
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    "vue-mathjax": VueMathjax,
  },
  data() {
    return {
      accessToken : null,
      //---------------------------------
      drawer: true,
      formula: "$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$",
      showAnswerAlert: false,
      deleteConfirm: false,
      itemToDelete: null,
      msg: "Welcome to Your Vue.js App",
      //-----------------Add Form
      showAddPanel: false,
      addFormModel: {},
      mode: "add",

      addTopic: "",
      addKeywords: "",
      addQuestion: "",
      addUUID: "",
      addAnswer: "",
      addSender: "",

      //----------------------------
      currentTask: {
        uuid: "1",
        sender: "",
        question: "",
        topic: "",
        keywords: [],
        image: null,
        answer: "",
      },
      //------------------------------------
      showCategoryQuestion: false,
      currentQuestionIndex: 0,
      selectedCategory: "",
      categoryItems: [],
      question: {
        uuid: "1",
        sender: "",
        question: "",
        topic: "",
        keywords: [],
        image: null,
        answer: "",
      },

      //-----------------------------------
      dialog: false,
      showPreview: false,
      allQuestions: [],
      allTopics: [],
      items: [
        { title: "Home", icon: "mdi-home-city", content: "home" },
        { title: "Dodaj pytanie", icon: "mdi-chat-question", content: "add" },
      ],
      search: "",
      headers: [
        { text: "Prowadzący", value: "sender" },
        { text: "temat", value: "topic" },
        { text: "Pytanie", value: "question" },
        { text: "Słowa kluczowe", value: "keywords" },
        { text: "Odpowiedź", value: "chooseTask", sortable: false },
      ],
    };
  },
  computed: {
    parseAnswerJson() {
      return this.currentTask.answer;
    },
    parseQuestionJson() {
      return this.question.answer;
    },
  },
  methods: {
    searchAnswer(question) {
      const query = question.question;
      const url = "https://www.google.com/search?q=" + query;
      window.open(url, "_blank");
    },
    sendForm() {
      if (this.addFormModel &&  true) {
        const payload = {
          sender: this.addSender,
          question: this.addQuestion,
          topic: this.addTopic,
          keywords: this.addKeywords.split(","),
          answer: this.addAnswer.split("^^^"),
          uuid: this.mode == "add" ? null : this.addUUID,
        };

        if (this.mode == "add") {
          add(payload);
          this.fetchData();
          this.showAddPanel = false;
        } else if (this.mode == "edit") {
          edit(payload);
          this.fetchData();
          this.showAddPanel = false;
        }
      }
    },
    submit() {
      this.$refs.observer.validate();
    },
    clear() {
      this.addQuestion = "";
      this.addAnswer = "";
      this.addTopic = "";
      this.addKeywords = "";
      this.addSender = "";
      this.addUUID = null;
    },
    handleClick(item) {
      if (item.content === "add") {
        this.clear();
        this.mode = "add";
        this.showAddPanel = true;
      }
      if (item.content === "home") {
        this.drawer = false;
      }
    },
    randomListIndex(list) {
      return Math.floor(Math.random() * list.length)
    },
    randomQuestion(item) {
      this.selectedCategory = item;

      this.categoryItems = this.allQuestions.filter((el) => {
        if (item === "Wszystkie") {
          return el;
        } else {
          return el.topic === item;
        }
      });

      this.currentQuestionIndex = this.randomListIndex(this.categoryItems);
      this.question =
      this.categoryItems[this.randomListIndex(this.categoryItems)];
      this.showCategoryQuestion = true;
    },
    renderRandomCategoryQuestion() {
      this.question =
        this.categoryItems[this.randomListIndex(this.categoryItems)];
    },
    renderNextCategoryQuestion() {
      if (this.currentQuestionIndex + 1 > this.categoryItems.length - 1) {
        this.currentQuestionIndex = 0;
      } else {
        this.currentQuestionIndex += 1;
      }

      this.question = this.categoryItems[this.currentQuestionIndex];
    },
    chooseItem(item) {
      this.currentTask = item;
      setTimeout(() => {
        this.dialog = true;
      }, 400);
    },
    removeItem(item) {
      this.deleteConfirm = true;
      this.itemToDelete = item.uuid;
    },
    confirmedRemove() {
      remove(this.itemToDelete);
      this.fetchData();
      this.deleteConfirm = false;
    },
    editItem(item) {
      this.addSender = item.sender;
      this.addQuestion = item.question;
      this.addTopic = item.topic;
      this.addKeywords = item.keywords.join(",");
      this.addAnswer = item.answer.join("^^^");
      this.addUUID = item.uuid;

      this.mode = "edit";
      this.showAddPanel = true;
    },
    async fetchData() {
      this.allQuestions = await getCities();

      let topics = [];
      topics.push("Wszystkie");
      for (let el of this.allQuestions) {
        if (!topics.includes(el.topic)) {
          topics.push(el.topic);
        }
      }
      this.allTopics = topics;
    },
  },
  async mounted() {
    //localStorage.setItem('d00pa', 'wit');
    this.accessToken = localStorage.getItem('d00pa')
    this.fetchData();
  },
};
</script>

<style>
.page-container {
  background: white;
  padding-top: 1rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  min-height: 100%;
  padding: 0 0 0 0;
  margin: 0 0 0 0;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  padding: 30px 30px !important;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  padding: 0 0;
  padding: 0 0 0 0;
}
.MathJax {
  font-size: 23px !important;
}
</style>
