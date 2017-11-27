/* EMAIL */

QUnit.test("email",function(assert){
	assert.ok(rules.email("ldiuhweiu") === false, "invalid email");
	assert.ok(rules.email("harry@gmail.com") === true, "valid email");
	assert.ok(rules.email("harry@hotmail.co.uk") === true, "subdomain email hosts");
	assert.ok(rules.email("harry-smith@hotmail.co.uk") === true, "email conatins hyphen");
});

/* REQUIRED */
QUnit.test( "required",function( assert ) {
	assert.ok(rules.required(" ") === true, "space");
	assert.ok(rules.required('med') === true, "real value");
	assert.ok(rules.required("false") === true, "semantic false");
	assert.ok(rules.required(0) === true, "zero");
	
});

/* URL */
QUnit.test("url",function(assert) {
	assert.equal(rules.url("google.com"), false, "no protocol");
	assert.equal(rules.url("ftp://google.com"), true, "ftp protocol");
	assert.equal(rules.url("ftp://google"), false, "no top level domain");
	assert.equal(rules.url("http://mysite.co.cc"), true, "subdomain");
	assert.equal(rules.url("http://google.com"), true, "valid url");
	assert.equal(rules.url("http://wite-with-hyphen.com"), true, "url conatins hyphen");
	assert.equal(rules.url("https://secure.com"), true, "https protocol");
});

/* NUMERIC */
QUnit.test("numeric",function(assert) {
	assert.equal(rules.numeric(123), true, "integer");
	assert.equal(rules.numeric(5.5), true, "float");
	assert.equal(rules.numeric(-1), true, "negative number");
	assert.equal(rules.numeric("123"), true, "string integer");
	assert.equal(rules.numeric("123.456"), true, "string float");
	assert.equal(rules.numeric("fifty"), false, "word");
	assert.equal(rules.numeric("3e-17"), true, "string e-notation");
	assert.equal(rules.numeric(3e-17), true, "e-notation");
});

/* ALPHANUMERIC */
QUnit.test("alphanumeric",function(assert) {
	assert.equal(rules.alphaNumeric(123),true,"actual integer");
	assert.equal(rules.alphaNumeric("123"),true,"integer only");
	assert.equal(rules.alphaNumeric("123abc"),true,"integer then alpha");
	assert.equal(rules.alphaNumeric("abc123"),true,"alpha then integer");
	assert.equal(rules.alphaNumeric("abc123def"),true,"alpha integer alpha");
	assert.equal(rules.alphaNumeric("123abc456"),true,"integer alpha integer");
	assert.equal(rules.alphaNumeric("_@##"),false,"invalid characters");
	assert.equal(rules.alphaNumeric("abc123@"),false,"invalid + valid characters");
	assert.equal(rules.alphaNumeric("ABC"),true,"capitals");
	assert.equal(rules.alphaNumeric("ãúďĩ"),false,"unicode");
});

/* RANGE */

QUnit.test("range",function(assert) {
	assert.equal(rules.range(-1,"0,10"), false, "below range");
	assert.equal(rules.range(11,"0,10"), false, "above range");
	assert.equal(rules.range(5,"0,10"), true, "within range");
	assert.equal(rules.range(0,"0,10"), true, "lower bound");
	assert.equal(rules.range(10,"0,10"), true, "upper bound");
	assert.equal(rules.range(0,"-10,10"), true, "negative and positive range");
	assert.equal(rules.range(-5,"-10,-2"), true, "negative range bound");
});


/* MAX LENGTH */
QUnit.test("max length",function(assert) {
	assert.equal(rules.maxLength("short", 10), true,"within limit");
	assert.equal(rules.maxLength("lengthy", 4), false,"exceed length");
	assert.equal(rules.maxLength("          ",4), false,"empty string");
});

/* MIN LENGTH */
QUnit.test("min length", function(assert) {
	assert.equal(rules.minLength("short", 10), false, "short");
	assert.equal(rules.minLength("lengthy", 4), true, "lengthy");
	assert.equal(rules.minLength(" ", 4), false, "empty string");
});

/*LENGTH */
QUnit.test("min length", function(assert) {
	assert.equal(rules.length("short", 10), false, "short string");
	assert.equal(rules.length("four", 4), true, "exact length");
	assert.equal(rules.length(" ", 4), false, "empty string");
	assert.equal(rules.length("loooooong ", 4), false, "long string");
});

/* HAS */
QUnit.test("has", function(assert) {
	assert.equal(rules.has("12345","4"), true, "numbers test");
	assert.equal(rules.has("12345",4), true, "actual numbers test");
	assert.equal(rules.has("mary had a little lamb","little"), true, "words test");
	assert.equal(rules.has("big","bigger"), false, "needle bigger than the haystack");
});

/* NOT */
QUnit.test("not", function(assert) {
	assert.equal(rules.not("value","value"), false, "string comparison");
	assert.equal(rules.not(7,7), false, "number comparison");
	assert.equal(rules.not("7",7), false,"string vs number comparison");
});

/* IS */
QUnit.test("is", function(assert) {
	assert.equal(rules.is("value","value"), true, "string comparison");
	assert.equal(rules.is(7,7), true, "number comparison");
	assert.equal(rules.is("7",7), true,"string vs number comparison");
});

/* BLACKLIST */
QUnit.test("blackList", function(assert) {
	assert.equal(rules.blackList("needle", "needle, in, hay, stack"), false,"blacklist word present");
	assert.equal(rules.blackList("pig","needle,in,hay,stack"), true, "blacklist word absent");
	assert.equal(rules.blackList(1,"1,2,3,4,5"), false, "numbers are semantically compared");
});


/* CONTAINS */
QUnit.test("contains", function(assert) {
	assert.equal(rules.contains("needle","numbers:1, chars:2, symbols: 3"), false, "word does not contain character types");
	assert.equal(rules.contains("1needle@!%","numbers:1, chars:2, symbols: 3"), true, "word  contains character types");
});


/*MATCH*/
/*
 * Input field required to run this test
 */
QUnit.test("match", function(assert) {
	assert.equal(rules.match("needle", '.match'), false, "word does not match");
	assert.equal(rules.match("match", '.match'), true, "word match");
});

/*ATLEAST*/
/*
 * Input field required to run this test
 */
QUnit.test("atleast", function(assert) {
	assert.equal(rules.atLeast("1876", '1, .tel'), true, "one field required");
	assert.equal(rules.atLeast("1876", '2, .tel'), false, "two field required");
	assert.equal(rules.atLeast("1876", '0, .tel'), true, "no field required");
});