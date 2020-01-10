<script>
  import "./styles.less";
  import moment from "moment";
  import "moment/locale/pl";
  import { time } from "./stores.js";

  import TimeCounter from "./TimeCounter/index.svelte";

  moment.locale("pl");
</script>

<h1>Timerto.xyz</h1>
<TimeCounter title="asas" date={moment().add(1, 'years')} />
<TimeCounter date={moment().add(2, 'years')} />
<TimeCounter date={moment().add(2, 'months')} />
<TimeCounter date={moment().add(2, 'days')} />
<TimeCounter date={moment().add(2, 'minutes')} />
<TimeCounter date={moment().add(10, 'seconds')} />
