<script setup lang="ts"></script>

<template>
  <Card :sty="{ width: `1f` }">
    <Row
      :sty="{
        width: `1f`,
        spacing: $Spacing.spaceBetween,
      }"
    >
      <Text hint :sty="{ width: `1f`, align: $Align.centerLeft }"
        >Tue, March 10th 2021</Text
      >
      <DeleteOptionsButton />
    </Row>
    <Text :sty="{ width: `1f`, align: $Align.centerLeft }"
      >12345 - Client A</Text
    >

    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ width: `1f`, align: $Align.centerLeft }">10.589</Text>
        <Text>of:</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ width: `1f`, align: $Align.centerLeft }">GAUL</Text>
        <Text>to:</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
          align: $Align.centerLeft,
          spacing: 0.25,
        }"
      >
        <Text :sty="{ width: `1f`, align: $Align.centerLeft }">Tank B</Text>
      </Row>
    </Row>
    <Row
      :sty="{
        width: `1f`,
        spacing: 0.25,
      }"
    >
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text>Rate:</Text>
        <Text :sty="{ width: `1f`, align: $Align.centerLeft }">$4.391</Text>
      </Row>
      <Row
        :sty="{
          width: `1f`,
          spacing: 0.25,
        }"
      >
        <Text>Total:</Text>
        <Text :sty="{ width: `1f`, align: $Align.centerLeft }">$46.50</Text>
      </Row>
    </Row>
  </Card>
</template>
