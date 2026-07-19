package com.lxcmyhealthhub

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.LinearLayout
import android.widget.ImageView
import android.widget.ScrollView
import android.widget.TextView
import android.widget.Toast
import android.graphics.drawable.GradientDrawable

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.WHITE
        window.decorView.systemUiVisibility = 8192
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.rgb(247, 249, 253))
            val statusBarId = resources.getIdentifier("status_bar_height", "dimen", "android")
            val statusBarHeight = if (statusBarId > 0) resources.getDimensionPixelSize(statusBarId) else 0
            setPadding(0, statusBarHeight, 0, 0)
        }
        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(28, 30, 28, 36)
        }
        val header = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(22, 18, 22, 18)
            background = rounded(Color.rgb(11, 78, 166), 28)
        }
        header.addView(ImageView(this).apply { setImageResource(com.lxcmyhealthhub.R.drawable.myhealthhub_icon) }, LinearLayout.LayoutParams(54, 54))
        header.addView(TextView(this).apply {
            text = "  MyHealthHub\n  Space"
            textSize = 18f
            setTextColor(Color.WHITE)
        }, LinearLayout.LayoutParams(0, -2, 1f))
        header.addView(TextView(this).apply { text = "♡  ◉"; textSize = 22f; setTextColor(Color.WHITE) })
        content.addView(header, LinearLayout.LayoutParams(-1, 141))
        content.addView(label("Health Vault  ●", 22f, Color.rgb(19, 39, 79)), margin(0, 24, 0, 4))
        content.addView(label("Your records. Secure. Private. Always in your control.", 13f, Color.DKGRAY), margin(0, 0, 0, 18))
        content.addView(actionRow(), margin(0, 0, 0, 22))
        content.addView(tabRow(), margin(0, 0, 0, 14))
        content.addView(record("▤", "Blood Test Report", "14 May 2024  ·  City Labs", "PDF", Color.rgb(231, 242, 255)), margin(0, 0, 0, 12))
        content.addView(record("◉", "X-Ray Chest", "10 May 2024  ·  HealthScan", "DICOM", Color.rgb(240, 235, 255)), margin(0, 0, 0, 12))
        content.addView(record("ℙ", "Prescription", "Dr. Neha Sharma  ·  08 May 2024", "2 Medicines", Color.rgb(231, 249, 242)), margin(0, 0, 0, 12))
        content.addView(record("▣", "Consultation Note", "Dr. Neha Sharma  ·  08 May 2024", "", Color.rgb(255, 237, 245)), margin(0, 0, 0, 22))
        content.addView(label("Visit Timeline", 18f, Color.rgb(19, 39, 79)), margin(0, 0, 0, 10))
        content.addView(card("○   08 May 2024  ·  11:00 AM\n     Consultation with Dr. Neha Sharma\n     Cardiology  ·  Apollo Clinic     ›", "", Color.WHITE), margin(0, 0, 0, 18))
        val scroll = ScrollView(this).apply { setBackgroundColor(Color.rgb(247, 249, 253)); addView(content) }
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        root.addView(bottomNav(), LinearLayout.LayoutParams(-1, 108))
        setContentView(root)
    }

    private fun label(text: String, size: Float, color: Int) = TextView(this).apply { this.text = text; textSize = size; setTextColor(color) }
    private fun card(title: String, body: String, color: Int) = TextView(this).apply {
        text = "$title\n$body"; textSize = 16f; setTextColor(if (color == Color.rgb(242, 58, 133)) Color.WHITE else Color.rgb(35, 40, 52)); setPadding(22, 18, 22, 18); background = rounded(color, 20)
    }
    private fun actionRow() = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        arrayOf("▣\nABHA\nLinked", "♧\nSecure\nSharing", "♧\nConsent\nManager", "◷\nActivity\nLog").forEach { value ->
            val index = childCount
            val colors = intArrayOf(Color.rgb(231, 242, 255), Color.rgb(255, 237, 245), Color.rgb(231, 249, 242), Color.rgb(240, 235, 255))
            addView(TextView(this@MainActivity).apply { text = value; gravity = Gravity.CENTER; textSize = 12f; setTextColor(Color.rgb(24, 70, 145)); setPadding(4, 15, 4, 15); background = rounded(colors[index], 16) }, LinearLayout.LayoutParams(0, 112, 1f).apply { setMargins(4, 0, 4, 0) })
        }
    }
    private fun tabRow() = TextView(this).apply { text = "All Records     Reports     Prescriptions     Visits"; textSize = 12f; setTextColor(Color.rgb(14, 74, 158)); setPadding(14, 14, 14, 14); background = rounded(Color.rgb(231, 239, 251), 18) }
    private fun record(icon: String, title: String, subtitle: String, tag: String, tint: Int) = TextView(this).apply { text = "$icon   $title                                      ›\n       $subtitle\n       $tag"; textSize = 14f; setTextColor(Color.rgb(35, 40, 52)); setPadding(16, 17, 10, 17); background = rounded(Color.WHITE, 18).apply { setStroke(2, tint) } }
    private fun bottomNav() = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
        gravity = Gravity.CENTER
        setPadding(4, 12, 4, 12)
        background = rounded(Color.WHITE, 20).apply { setStroke(2, Color.rgb(231, 222, 239)) }
        addView(navItem(R.drawable.ic_nav_home, "Home", Color.rgb(231, 242, 255)), LinearLayout.LayoutParams(0, 96, 1f))
        addView(navItem(R.drawable.ic_nav_health, "Health", Color.rgb(255, 237, 245)), LinearLayout.LayoutParams(0, 96, 1f))
        addView(navItem(0, "", Color.rgb(242, 58, 133), true), LinearLayout.LayoutParams(0, 96, 1f))
        addView(navItem(R.drawable.ic_nav_vault, "Vault", Color.rgb(231, 249, 242)), LinearLayout.LayoutParams(0, 96, 1f))
        addView(navItem(R.drawable.ic_nav_more, "More", Color.rgb(240, 235, 255)), LinearLayout.LayoutParams(0, 96, 1f))
    }
    private fun navItem(icon: Int, title: String, tint: Int, primary: Boolean = false) = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        gravity = Gravity.CENTER
        val iconView = if (primary) TextView(this@MainActivity).apply { text = "+"; textSize = 32f; gravity = Gravity.CENTER; setTextColor(Color.WHITE); background = rounded(tint, 60) } else ImageView(this@MainActivity).apply { setImageResource(icon); setPadding(9, 9, 9, 9); background = rounded(tint, 10) }
        iconView.setOnClickListener { Toast.makeText(this@MainActivity, if (title.isEmpty()) "New health action" else "$title selected", Toast.LENGTH_SHORT).show() }
        addView(iconView, LinearLayout.LayoutParams(if (primary) 58 else 44, if (primary) 58 else 44))
        if (title.isNotEmpty()) addView(TextView(this@MainActivity).apply { text = title; textSize = 10f; gravity = Gravity.CENTER; setTextColor(Color.rgb(35, 40, 52)); setPadding(0, 3, 0, 0) })
    }
    private fun rounded(color: Int, radius: Int) = GradientDrawable().apply { setColor(color); cornerRadius = radius.toFloat() }
    private fun margin(l: Int, t: Int, r: Int, b: Int) = LinearLayout.LayoutParams(-1, -2).apply { setMargins(l, t, r, b) }
}
