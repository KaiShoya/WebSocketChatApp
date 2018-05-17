package jp.shoya.kai.websocketsample

import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView

class MainActivity : AppCompatActivity(), View.OnClickListener {
  private lateinit var linearLayout: LinearLayout
  private lateinit var scrollView: ScrollView

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    findViewById<View>(R.id.submit).setOnClickListener(this)

    linearLayout = findViewById(R.id.linerLayout)
    scrollView = findViewById(R.id.scrollView)
  }

  override fun onClick(view: View?) {
    view ?: return
    when (view.id) {
      R.id.submit -> {
        val text = findViewById<EditText>(R.id.editText)
        val view = TextView(this)
        view.text = text.text
        linearLayout.addView(view)
        scroll()
        text.text.clear()
      }
    }
  }

  private fun scroll() = scrollView.post({scrollView.fullScroll(View.FOCUS_DOWN)})
}
